const api='/api'; let uploadApi='/api'; let hlsInstance=null; let activeJobPoll=null; let currentUploadXhr=null; let currentSourceTab='link'; let uploadQueue=[]; let uploadQueueRunning=false; let currentQueueIndex=-1; let currentQueueFileName=''; let cancelCurrentItemRequested=false; let currentTempUploadItem=null; let activeJobResolve=null; const UPLOAD_QUEUE_KEY='hls_upload_queue_v2'; const AUTH_TOKEN_KEY='hls_admin_token'; let subtitleModeEnabled=false;
    let selectedVideoIds=new Set();
    let currentVideoList=[];
    let currentBgJobId='';
    const BG_JOB_KEY='hls_active_job_id';
    const $=id=>document.getElementById(id);



    function setUploadProgress(p,t='',meta=''){const b=$('upload_progress'),tx=$('upload_progress_text'),mt=$('upload_progress_meta'),w=$('upload_progress_wrap'); b.value=Math.max(0,Math.min(100,p||0)); tx.textContent=normalizeUiText(t||`${Math.round(b.value)}%`); if(mt) mt.textContent=normalizeUiText(meta||' '); if(w){const show=(b.value>0&&b.value<100)||/xử lý|upload|huỷ|lỗi|hoàn tất/i.test((tx.textContent||'')+' '+(mt?.textContent||'')); w.style.display=show?'block':'none';}}
    function updateFloatingBadgeLayout(){const q=$('floatingQueue'),b=$('bgJobBadge'); if(!b) return; const qVisible=!!q && q.style.display!=='none'; const baseBottom=16, gap=14; b.style.bottom=qVisible?`${Math.max(baseBottom,(q.offsetHeight||0)+baseBottom+gap)}px`:`${baseBottom}px`;}
    function showBgBadge(text,meta='',pct=null){const el=$('bgJobBadge'),t=$('bgJobBadgeTitle'),m=$('bgJobBadgeMeta'),b=$('bgJobBadgeBar'); if(!el) return; if(t) t.textContent=text||'Đang xử lý nền...'; if(m) m.textContent=meta||''; if(b && pct!=null){const v=Math.max(0,Math.min(100,Number(pct)||0)); b.style.width=v+'%';} updateFloatingBadgeLayout(); el.classList.add('show')}
    function hideBgBadge(delay=0){const el=$('bgJobBadge'); if(!el) return; if(delay>0){setTimeout(()=>{el.classList.remove('show'); updateFloatingBadgeLayout();},delay)}else{el.classList.remove('show'); updateFloatingBadgeLayout();}}

    let floatingQueueHideTimer=null;
    function renderFloatingQueue(){
      const box=$('floatingQueue'),body=$('floatingQueueBody'),title=$('floatingQueueTitle');
      if(!box||!body||!title) return;
      const now=Date.now();
      const active=(uploadQueue||[]).filter(it=>{const s=String(it?.status||'').toLowerCase(); return Number(it?.doneAt||0)<=0 || s.includes('đang') || s.includes('upload') || s.includes('chờ');});
      const recentDone=(uploadQueue||[]).filter(it=>{const s=String(it?.status||'').toLowerCase(); const doneAt=Number(it?.doneAt||0); if(!doneAt) return false; if(!(s==='xong'||s==='đã huỷ'||s==='hoàn tất'||s==='success'||s==='cancelled'||s==='error'||s==='lỗi')) return false; return (now-doneAt)<=15000;});
      const visible=active.length?active:recentDone;
      if(!visible.length){ box.style.display='none'; if(floatingQueueHideTimer){clearTimeout(floatingQueueHideTimer); floatingQueueHideTimer=null;} updateFloatingBadgeLayout(); return; }
      box.style.display='block';
      title.textContent=`Uploading (${visible.length})`;
      body.innerHTML=visible.slice(0,6).map(it=>{ const rawPct=Number(it?._lastProgressPct||0); const pct=Math.max(0,Math.min(100,rawPct||(/xong|hoàn tất|success|cancelled|đã huỷ|lỗi/i.test(String(it?.status||''))?100:0))); return `<div style="padding:6px 0;border-bottom:1px dashed rgba(120,148,198,.24)"><div style="font-weight:700;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(it.name||'')}</div><div style="font-size:11px;color:#bdd0ee;margin:2px 0 6px">${esc(normalizeUiText(it.status||'chờ'))}</div><div style="height:6px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#4f8cff,#7b4dff)"></div></div></div>`; }).join('');
      if(floatingQueueHideTimer){ clearTimeout(floatingQueueHideTimer); floatingQueueHideTimer=null; }
      if(!active.length && recentDone.length){
        floatingQueueHideTimer=setTimeout(()=>{ const q=$('floatingQueue'); if(q) q.style.display='none'; updateFloatingBadgeLayout(); },15000);
      }
      updateFloatingBadgeLayout();
    }
    function toggleFloatingQueue(){ const b=$('floatingQueueBody'); if(!b) return; b.style.display=(b.style.display==='none'?'block':'none'); }
    function saveActiveJob(id){try{if(id){localStorage.setItem(BG_JOB_KEY,id)}else{localStorage.removeItem(BG_JOB_KEY)}}catch(e){}}
    function getSavedActiveJob(){try{return localStorage.getItem(BG_JOB_KEY)||''}catch(e){return ''}}
    function persistUploadQueue(){
      try{const safe=uploadQueue.map(it=>({id:it.id||'',name:it.name||it.file?.name||'',size:Number(it.size||it.file?.size||0),status:it.status||'chờ',jobId:it.jobId||'',token:it.token||'',resumeToken:it.resumeToken||'',tempFile:it.tempFile||'',error:it.error||'',doneAt:Number(it.doneAt||0),resumeProgressPct:Number(it._lastProgressPct||0),config:it.config||null})); localStorage.setItem(UPLOAD_QUEUE_KEY,JSON.stringify(safe));}catch(e){}
    }
    function restoreUploadQueue(){
      try{const raw=localStorage.getItem(UPLOAD_QUEUE_KEY)||'[]'; const arr=JSON.parse(raw)||[]; if(!Array.isArray(arr)) return; const now=Date.now(); uploadQueue=arr.map(x=>{const st=String(x.status||'chờ'); const s=st.trim().toLowerCase(); const token=String(x.token||''); const resumeToken=String(x.resumeToken||''); const tempFile=String(x.tempFile||''); let doneAt=Number(x.doneAt||0); const isFinishedByStatus=(s==='xong'||s==='đã huỷ'||s==='lỗi'||s==='hoàn tất'||s==='cancelled'||s==='canceled'||s==='error'||s==='success'||s==='completed'||s==='failed'||s==='done'); const isFinished=isFinishedByStatus || doneAt>0; const canResumeProcessed = !isFinished && !!token && (s==='đã upload' || s==='uploaded' || s==='chờ xử lý' || s==='waiting process' || s==='đang chạy' || s==='running'); const canResumeUpload = !isFinished && !!resumeToken && !token; if(isFinished && !doneAt) doneAt=now; return {id:x.id||('q_'+Date.now()+Math.random().toString(36).slice(2,7)),name:String(x.name||''),size:Number(x.size||0),status:(canResumeProcessed?(s==='đang chạy'?'đã upload':st):(canResumeUpload?'chờ':st)),jobId:String(x.jobId||''),token:token,resumeToken:resumeToken,tempFile:tempFile,error:String(x.error||''),doneAt:doneAt,_lastProgressPct:Number(x.resumeProgressPct||0),config:x.config||null,file:null};});}catch(e){uploadQueue=[]}
      pruneFinishedUploadQueue();
    }
    function syncHiddenSwitch(id){const el=$(id),btn=$(id+'_toggle'),txt=$(id+'_text'); const nowOn=(el?.value==='1'); btn?.classList.toggle('on',nowOn); if(txt) txt.textContent=nowOn?tr('Đang bật','Enabled'):tr('Đang tắt','Disabled'); const chip=$('flag_'+id); if(chip) chip.textContent=nowOn?'ON':'OFF';}
    function toggleHiddenSwitch(id){const el=$(id); if(!el) return; el.value=(el.value==='1'?'0':'1'); syncHiddenSwitch(id)}
    function toggleModeFlag(id){toggleHiddenSwitch(id); queueAutoSave()}
    function toggleHlsSwitch(){const el=$('enable_hls'),btn=$('enable_hls_toggle'),txt=$('enable_hls_text'); const on=(el.value==='1'); el.value=on?'0':'1'; const nowOn=el.value==='1'; btn?.classList.toggle('on',nowOn); if(txt) txt.textContent=nowOn?tr('Đang bật','Enabled'):tr('Đang tắt','Disabled');}
    function renderOriginalStorageOptions(){
      const el=$('original_storage_mode'); if(!el) return;
      const current=el.value||'';
      const defs=[['ftp','FTP Server'],['r2','Cloudflare R2'],['b2','Backblaze B2'],['gdrive','Google Drive']];
      const opts=['<option value="">-- Chọn 1 storage --</option>'];
      defs.forEach(([mode,label])=>{
        const enabled=(val(mode+'_mode_enabled')||'1')==='1';
        if(!enabled) return;
        let usable=false;
        if(mode==='local') usable=true;
        else {
          try{usable=normalizePool(mode).some(acc=>acc && acc.enabled!==false);}catch(e){usable=false}
        }
        if(!usable) return;
        opts.push(`<option value="${mode}">${label}</option>`);
      });
      el.innerHTML=opts.join('');
      if(current && [...el.options].some(o=>o.value===current)) el.value=current;
      else if(current) el.value='';
    }
    function updateOriginalStorageField(){const wrap=$('original_storage_field'); if(wrap) wrap.style.display=isKeepOriginal()?'block':'none'; renderOriginalStorageOptions();}
    function toggleKeepOriginalSwitch(){const el=$('keep_original'),btn=$('keep_original_toggle'),txt=$('keep_original_text'); const on=(el.value==='1'); el.value=on?'0':'1'; const nowOn=el.value==='1'; btn?.classList.toggle('on',nowOn); if(txt) txt.textContent=nowOn?tr('Đang bật','Enabled'):tr('Đang tắt','Disabled'); updateOriginalStorageField();}
    function toggleThumbnailSwitch(){const el=$('create_thumbnail'),btn=$('create_thumbnail_toggle'),txt=$('create_thumbnail_text'); const on=(el.value==='1'); el.value=on?'0':'1'; const nowOn=el.value==='1'; btn?.classList.toggle('on',nowOn); if(txt) txt.textContent=nowOn?tr('Đang bật','Enabled'):tr('Đang tắt','Disabled');}
    function toggleRenameSegmentSwitch(){const el=$('rename_segment'),btn=$('rename_segment_toggle'),txt=$('rename_segment_text'); const on=(el.value==='1'); el.value=on?'0':'1'; const nowOn=el.value==='1'; btn?.classList.toggle('on',nowOn); if(txt) txt.textContent=nowOn?tr('Đang bật','Enabled'):tr('Đang tắt','Disabled');}
    function toggleEncryptHlsSwitch(){const plan=(val('license_plan')||'trial').toLowerCase(); if(!hasLicenseFeature('encrypt_hls', plan==='premium')) return alert('License hiện tại không hỗ trợ mã hoá HLS'); const el=$('encrypt_hls'),btn=$('encrypt_hls_toggle'),txt=$('encrypt_hls_text'); const on=(el.value==='1'); el.value=on?'0':'1'; const nowOn=el.value==='1'; btn?.classList.toggle('on',nowOn); if(txt) txt.textContent=nowOn?tr('Đang bật','Enabled'):tr('Đang tắt','Disabled');}
    function togglePresetSwitch(id){const el=$(id),btn=$(id+'_toggle'),txt=$(id+'_text'); if(!el) return; const on=(el.value==='1'); el.value=on?'0':'1'; const nowOn=el.value==='1'; btn?.classList.toggle('on',nowOn); if(txt) txt.textContent=nowOn?tr('Đang bật','Enabled'):tr('Đang tắt','Disabled');}
    function togglePresetEnableHlsSwitch(){togglePresetSwitch('preset_enable_hls')}
    function renderPresetOriginalStorageOptions(){
      const el=$('preset_original_storage_mode'); if(!el) return;
      const cur=el.value||'';
      const defs=[['ftp','FTP Server'],['r2','Cloudflare R2'],['b2','Backblaze B2'],['gdrive','Google Drive']];
      const opts=['<option value="">-- Chọn 1 storage --</option>'];
      defs.forEach(([mode,label])=>{const enabled=(val(mode+'_mode_enabled')||'1')==='1'; if(!enabled) return; let usable=false; if(mode==='local') usable=true; else {try{usable=normalizePool(mode).some(acc=>acc && acc.enabled!==false)}catch(e){usable=false}} if(!usable) return; opts.push(`<option value="${mode}">${label}</option>`);});
      el.innerHTML=opts.join('');
      if(cur && [...el.options].some(o=>o.value===cur)) el.value=cur; else if(cur) el.value='';
    }
    function updatePresetOriginalStorageField(){const wrap=$('preset_original_storage_field'); if(wrap) wrap.style.display=(($('preset_keep_original')?.value==='1')?'block':'none'); renderPresetOriginalStorageOptions();}
    function togglePresetKeepOriginalSwitch(){togglePresetSwitch('preset_keep_original'); updatePresetOriginalStorageField()}
    function togglePresetThumbnailSwitch(){togglePresetSwitch('preset_create_thumbnail')}
    function togglePresetRenameSegmentSwitch(){togglePresetSwitch('preset_rename_segment')}
    function togglePresetEncryptHlsSwitch(){togglePresetSwitch('preset_encrypt_hls')}
    function chooseSourceTab(tab){currentSourceTab=tab; ['link','file'].forEach(x=>{$('tab-'+x)?.classList.toggle('active',x===tab); $('pane-'+x)?.classList.toggle('active',x===tab)}); refreshSubtitleUi()}
    function isSubtitleMode(){return subtitleModeEnabled===true}
    function clearSubtitleSelection(){const el=$('subtitle_file'); if(el) el.value='';}
    function refreshSubtitleUi(){
      const on=isSubtitleMode();
      const btn=$('subtitle_toggle');
      if(btn){btn.classList.toggle('active',on);}
      const box=$('subtitle_box'); if(box) box.style.display=(on && currentSourceTab==='file')?'block':'none';
      const hint=$('subtitle_video_hint'); if(hint) hint.style.display=(on && currentSourceTab==='file')?'block':'none';
      const note=$('upload_multi_note'); if(note) note.textContent=currentLang==='en'?'You can select multiple files for sequential upload queue (V1).':'Có thể chọn nhiều file để xếp hàng upload tuần tự (V1).';
      refreshSelectedUploadFiles();
    }
    function toggleSubtitleMode(){
      subtitleModeEnabled=!subtitleModeEnabled;
      if(!subtitleModeEnabled){ clearSubtitleSelection(); }
      refreshSubtitleUi();
    }
    function submitVideo(){if(currentSourceTab==='file') return uploadVideo(); return importVideo()}
    async function cancelCurrentJob(){
      const jobId=currentBgJobId||getSavedActiveJob();
      cancelCurrentItemRequested=true;
      if(currentUploadXhr){try{currentUploadXhr.abort()}catch(e){} currentUploadXhr=null;}
      if(currentTempUploadItem && currentTempUploadItem._xhr){try{currentTempUploadItem._xhr.abort()}catch(e){} currentTempUploadItem._xhr=null; currentTempUploadItem=null;}
      try{const running=(currentQueueIndex>=0?uploadQueue[currentQueueIndex]:null); if(running && running._xhr){running._xhr.abort(); running._xhr=null;}}catch(e){}
      if(activeJobPoll){clearInterval(activeJobPoll); activeJobPoll=null;}
      try{ if(jobId){ await apiJson(`${uploadApi}/jobs/${jobId}/cancel`,{method:'POST'}); } }catch(e){}
      if(activeJobResolve){const r=activeJobResolve; activeJobResolve=null; r({status:'cancelled',phase:'done',current_step:'Đã huỷ',step_detail:'Huỷ bởi người dùng'});} 
      if(currentQueueIndex>=0 && uploadQueue[currentQueueIndex]) { uploadQueue[currentQueueIndex].status='đã huỷ'; uploadQueue[currentQueueIndex].doneAt=Date.now(); }
      renderUploadQueue();
      persistUploadQueue();
      currentBgJobId=''; saveActiveJob('');
      setUploadProgress(0,'Đã huỷ video hiện tại',`Video: ${currentQueueFileName||'-'} • Đang chuyển sang video tiếp theo`);
      hideBgBadge();
      log('Đã huỷ video hiện tại');
    }


    async function pollJobStatus(jobId,fileLabel=''){
      if(!jobId) return null;
      if(activeJobPoll) clearInterval(activeJobPoll);
      currentBgJobId=jobId;
      saveActiveJob(jobId);
      const fileMeta=fileLabel?`Video: ${fileLabel}`:'';
      showBgBadge('Đang xử lý nền...',[fileMeta,'Đang lấy trạng thái job...'].filter(Boolean).join(' • '),0);
      return await new Promise((resolve)=>{
        activeJobResolve=resolve;
        activeJobPoll=setInterval(async()=>{
          try{
            const rs=await apiJson(`${uploadApi}/jobs/${jobId}`); const d=rs.data||{};
            const done=Number(d.modes_done||0), total=Number(d.modes_total||0);
            const cur=d.current_mode?`Sever: ${String(d.current_mode).toLowerCase()==='ttb'?'TikTok':String(d.current_mode).toUpperCase()}`:'';
            const step=d.current_step?`${tr('Bước','Step')}: ${normalizeUiText(d.current_step)}`:'';
            const detail=d.step_detail?normalizeUiText(String(d.step_detail).replace(/Tất cả sever đã hoàn thành/g, currentLang==='en'?'All servers completed':'Tất cả sever đã hoàn thành')):'';
            const pct=Number(d.progress_pct);
            const prog=Number.isFinite(pct)?Math.max(0,Math.min(100,pct)):(total>0?Math.min(99,Math.round((done/total)*100)):100);
            const meta=[fileMeta,step,cur,(total>0?`${tr('Đã xong','Completed')} ${done}/${total} ${currentLang==='en'?'server':'sever'}`:''),detail].filter(Boolean).join(' • ');
            setUploadProgress(d.phase==='done'?100:prog,normalizeUiText(d.message||'Đang xử lý...'),meta);
            showBgBadge(normalizeUiText(d.message||'Đang xử lý nền...'),meta,d.phase==='done'?100:prog);
            if(d.phase==='done'){
              clearInterval(activeJobPoll); activeJobPoll=null; currentBgJobId=''; saveActiveJob('');
              await loadVideos();
              const doneTxt=(d.status==='cancelled')?tr('Đã huỷ','Cancelled'):(d.status==='success'?tr('Hoàn tất','Completed'):tr('Có lỗi','Has errors'));
              setUploadProgress(100,doneTxt,meta||`${tr('Đã xong','Completed')} ${done}/${total||done} ${currentLang==='en'?'server':'sever'}`);
              showBgBadge(d.status==='cancelled'?`⛔ ${tr('Đã huỷ','Cancelled')}`:`✅ ${currentLang==='en'?'Done. You can press Play to view.':'Xong. Có thể bấm Play để xem.'}`,meta,100);
              refreshStorageUsageAfterJobDone();
              hideBgBadge(6000);
const r=activeJobResolve; activeJobResolve=null; if(r) r(d);
            }
          }catch(e){
            showBgBadge('Đang xử lý nền...',[fileMeta,'Đang chờ phản hồi từ worker...'].filter(Boolean).join(' • '),null);
          }
        },1500)
      });
    }


    function pickFirstPlayableFromResult(rs){const by=(rs?.data?.results)||{}; for(const m of Object.keys(by)){const r=by[m]; if(r?.hls?.master_playlist) return r.hls.master_playlist; if(r?.video?.webViewLink) return r.video.webViewLink;} return null}

    function renderUploadQueue(){
      const root=$('uploadQueueList'); if(!root){renderFloatingQueue(); return;}
      if(!uploadQueue.length){root.innerHTML='Chưa có file trong hàng chờ.'; renderFloatingQueue(); return;}
      root.innerHTML=uploadQueue.map((it,idx)=>{const st=String(it.status||''); const running=(st==='đang chạy'||st.startsWith('đang upload')||st.startsWith('đang khởi tạo')||st.startsWith('đang hoàn tất')); const finished=(st==='xong'||st==='đã huỷ'||st==='hoàn tất'||st==='success'||st==='cancelled'); const failed=(st==='lỗi'); const canRetry=failed && !!it.file && !it.token; const needPickForResume=!it.file && !!it.resumeToken && !it.token && !running; const canDelete=!running; const queued=(st==='chờ'||st==='đã upload'||st==='chờ xử lý'||st==='lỗi'); const rp=Number(it._lastProgressPct||0); const pctText=(queued && rp>0 && rp<100)?` • ${tr('đã upload','uploaded')} ${rp.toFixed(1)}%`:''; const info=[normalizeUiText(it.status||'chờ')+pctText, formatBytes(it.size||0), (it.error?('• '+normalizeUiText(it.error)):'')].join(' '); return `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px dashed var(--color-defaultBorder)"><div style="min-width:0"><div style="font-weight:700;color:var(--color-dark);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(it.name||'')}</div><div class="muted">${esc(info)}</div></div><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:flex-end">${needPickForResume?`<button class="btn-mini soft" type="button" onclick="pickFileForResume(${idx})">Resume</button>`:''}${canRetry?`<button class="btn-mini soft" type="button" onclick="retryUploadQueueItem(${idx})">Retry</button>`:''}<button class="btn-mini ${running?'test':'delete'}" type="button" onclick="cancelOrRemoveQueueItem(${idx})">${running?tr('Huỷ video này','Cancel'):tr('Xoá','Delete')}</button></div></div>`}).join('');
      persistUploadQueue();
      renderFloatingQueue();
    }
    function pruneFinishedUploadQueue(){
      if(uploadQueueRunning) return;
      const now=Date.now();
      const KEEP_MS=60*60*1000; // 1 giờ
      const isFinished=(st)=>{const s=String(st||'').trim().toLowerCase(); return s==='xong' || s==='đã huỷ' || s==='lỗi' || s==='hoàn tất' || s==='cancelled' || s==='error' || s==='success'};
      uploadQueue=uploadQueue.filter(it=>{
        if(!it) return false;
        if(!isFinished(it.status)) return true;
        let ts=Number(it.doneAt||0);
        if(!ts || !Number.isFinite(ts)){ ts=now; it.doneAt=ts; }
        return (now-ts)<KEEP_MS;
      });
      renderUploadQueue();
      persistUploadQueue();
    }
    async function pickFileForResume(idx){
      const it=uploadQueue[idx];
      if(!it || !it.resumeToken) return;
      const input=document.createElement('input');
      input.type='file';
      input.accept='video/*';
      input.onchange=async()=>{
        const f=input.files&&input.files[0]?input.files[0]:null;
        if(!f) return;
        it.file=f;
        it.name=it.name||f.name;
        it.size=Number(it.size||f.size||0);
        it.error='';
        // giữ resumeToken để retry đi đúng nhánh resume, không upload lại từ đầu
        it.token='';
        it.tempFile='';
        it.status='lỗi';
        renderUploadQueue();
        persistUploadQueue();
        await retryUploadQueueItem(idx);
      };
      input.click();
    }

    async function retryUploadQueueItem(idx){
      const it=uploadQueue[idx];
      if(!it || !it.file || it.token) return;
      it.error='';
      it.status='đang upload 0%';
      renderUploadQueue();
      try{
        setUploadProgress(5,'Đang upload lại file lên server...',it.name||'');
        await uploadQueueTempItem(it);
        it.status='đã upload';
        renderUploadQueue();
        persistUploadQueue();
        setUploadProgress(15,'Upload tạm hoàn tất','Đang xử lý tuần tự từng video...');
        await runUploadQueue();
      }catch(e){
        it.status='lỗi';
        it.error=e.message||'Upload tạm lỗi';
        it.doneAt=Date.now();
        renderUploadQueue();
        persistUploadQueue();
      }
    }
    async function removeUploadQueueItem(idx){
      const it=uploadQueue[idx];
      if(!it) return;
      const st=String(it.status||'');
      const running=(st==='đang chạy'||st.startsWith('đang upload')||st.startsWith('đang khởi tạo')||st.startsWith('đang hoàn tất'));
      if(running) return;
      let tok=it?.token||it?.resumeToken||'';
      if(!tok){const m=String(it?.tempFile||'').match(/\/(tmp_[A-Za-z0-9]+)_/); if(m&&m[1]) tok=m[1];}
      if(tok){try{await apiJson(`${uploadApi}/queue/temp/${tok}`,{method:'DELETE'})}catch(e){}}
      uploadQueue.splice(idx,1);
      renderUploadQueue();
      persistUploadQueue();
    }
    async function cancelOrRemoveQueueItem(idx){
      const it=uploadQueue[idx];
      if(!it) return;
      const st=String(it.status||'');
      const running=(st==='đang chạy'||st.startsWith('đang upload')||st.startsWith('đang khởi tạo')||st.startsWith('đang hoàn tất'));
      if(running){await cancelCurrentJob(); return;}
      await removeUploadQueueItem(idx);
    }
    async function clearUploadQueue(){if(uploadQueueRunning) return alert('Đang chạy hàng chờ, chưa thể xoá toàn bộ.'); for(let i=uploadQueue.length-1;i>=0;i--){await removeUploadQueueItem(i);} uploadQueue=[]; renderUploadQueue(); persistUploadQueue();}
    function setRunningQueueIndex(idx){
      uploadQueue.forEach((it,i)=>{ if(i===idx){it.status='đang chạy';} else if(it.status==='đang chạy'){it.status='chờ';} });
      currentQueueIndex=idx;
      renderUploadQueue();
    }
    function collectQueueProcessPayload(item,modes){
      const cfg=item.config||captureCurrentUploadConfig();
      const typedTitle=($('import_title').value||'').trim();
      const fallbackTitle=(item.name||'video').replace(/\.[^.]+$/,'');
      const title=typedTitle||fallbackTitle;
      const allowedQ=['480','720','1080','1440','2160'];
      const pickedQ=(Array.isArray(cfg.hls_quality)?cfg.hls_quality:[]).map(x=>String(x||'')).filter(x=>allowedQ.includes(x));
      const safeQ=pickedQ.length?pickedQ:['720'];
      return {token:item.token,temp_file:item.tempFile||'',name:item.name,import_title:title,enable_hls:!!cfg.enable_hls,keep_original:!!cfg.keep_original,original_storage_overrides:(cfg.keep_original&&cfg.original_storage_mode)?[cfg.original_storage_mode]:[],create_thumbnail:!!cfg.create_thumbnail,encrypt_hls:!!cfg.encrypt_hls,rename_segment:!!cfg.rename_segment,category:cfg.category||'',hls_quality:safeQ,storage_mode_overrides:(cfg.storage_mode_overrides||modes||[]),subtitle_file:item.subtitleFile||'',subtitle_name:item.subtitleName||''};
    }
    async function uploadQueueTempItem(item){
      const chunkMb=Math.max(1,Math.min(50,Number(val('upload_chunk_mb')||20)||20));
      const CHUNK_SIZE=chunkMb*1024*1024;
      let currentChunkSize=CHUNK_SIZE;
      let chunkShrinkCount=0;
      const total=Number(item?.file?.size||0);
      if(!item?.file || total<=0) throw new Error('File upload không hợp lệ');

      item.status='đang khởi tạo upload...';
      renderUploadQueue();

      let token=String(item.resumeToken||item.token||'');
      let uploaded=0;
      item._lastProgressPct=Math.max(0, Number(item._lastProgressPct||0));
      if(token){
        try{
          const st=await apiJson(`${uploadApi}/queue/upload-temp-status/${encodeURIComponent(token)}`);
          uploaded=Math.max(0,Math.min(total,Number(st?.data?.received||0)));
          item._lastProgressPct=Math.max(item._lastProgressPct||0,(uploaded/total)*100);
          item.resumeToken=token;
          item.status=`đang resume ${(item._lastProgressPct||0).toFixed(1)}%`;
          renderUploadQueue();
        }catch(e){
          token='';
          uploaded=0;
          item.resumeToken='';
        }
      }
      if(!token){
        const init=await apiJson(`${uploadApi}/queue/upload-temp-init`,{method:'POST',body:JSON.stringify({name:item.file.name||item.name||'upload.mp4',size:total})});
        token=String(init?.data?.token||'');
        if(!token) throw new Error('Không tạo được phiên upload chunk');
        item.resumeToken=token;
        persistUploadQueue();
      }


      const uploadChunk=(url, formData, onProgress)=>new Promise((resolve,reject)=>{
        const x=new XMLHttpRequest();
        item._xhr=x;
        currentTempUploadItem=item;
        x.open('POST',url,true);
        x.timeout=45000;
        const tk=localStorage.getItem(AUTH_TOKEN_KEY)||'';
        if(tk) x.setRequestHeader('Authorization','Bearer '+tk);
        x.upload.onprogress=(e)=>{ if(e.lengthComputable && typeof onProgress==='function') onProgress(e.loaded,e.total); };
        x.onload=()=>{
          item._xhr=null;
          if(currentTempUploadItem===item) currentTempUploadItem=null;
          const raw=String(x.responseText||'');
          let j={};
          try{ j=JSON.parse(raw||'{}'); }catch(e){
            const brief=raw.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,180);
            return reject(new Error(`Upload chunk lỗi (HTTP ${x.status})${brief?`: ${brief}`:''}`));
          }
          if(x.status<200 || x.status>=300 || j.status!=='success'){
            const details=(j&&j.errors&&typeof j.errors==='object')?Object.values(j.errors).flat().join(' • '):'';
            const msg=((j.message||'').toLowerCase().includes('given data was invalid')&&details)?details:(j.message||details||`Upload chunk lỗi (HTTP ${x.status})`);
            const er=new Error(msg); er.status=x.status; return reject(er);
          }
          resolve(j);
        };
        x.onerror=()=>{item._xhr=null; if(currentTempUploadItem===item) currentTempUploadItem=null; reject(new Error('Lỗi mạng upload chunk'))};
        x.ontimeout=()=>{item._xhr=null; if(currentTempUploadItem===item) currentTempUploadItem=null; reject(new Error('Chunk timeout, anh retry để resume tiếp'))};
        x.onabort=()=>{item._xhr=null; if(currentTempUploadItem===item) currentTempUploadItem=null; reject(new Error('Đã huỷ upload tạm'))};
        x.send(formData);
      });

      const chunkCount=Math.ceil(total/CHUNK_SIZE);
      let start=uploaded;
      while(start<total){
        if(cancelCurrentItemRequested) throw new Error('Đã huỷ upload tạm');
        let end=Math.min(total,start+currentChunkSize);
        let sent=false, lastErr=''; let lastStatus=0;
        for(let attempt=1;attempt<=3 && !sent;attempt++){
          try{
            if(attempt>1){
              item.status=`retry chunk (${attempt}/3)...`;
              renderUploadQueue();
            }
            end=Math.min(total,start+currentChunkSize);
            const blob=item.file.slice(start,end);
            const chunkBase=start;
            const x=await new Promise((resolve,reject)=>{
              const xhr=new XMLHttpRequest();
              item._xhr=xhr;
              currentTempUploadItem=item;
              const u=`${uploadApi}/queue/upload-temp-chunk-raw?token=${encodeURIComponent(token)}&offset=${encodeURIComponent(String(start))}&filename=${encodeURIComponent(item.file.name||'chunk.bin')}`;
              xhr.open('POST',u,true);
              xhr.timeout=45000;
              const tk=localStorage.getItem(AUTH_TOKEN_KEY)||'';
              if(tk) xhr.setRequestHeader('Authorization','Bearer '+tk);
              xhr.setRequestHeader('Content-Type','application/octet-stream');
              xhr.upload.onprogress=(e)=>{ if(e.lengthComputable){ const currentUploaded=Math.min(total, chunkBase+e.loaded); const pct=Math.max(0,Math.min(100,(currentUploaded/total)*100)); item._lastProgressPct=Math.max(Number(item._lastProgressPct||0), pct); item.status=`đang upload ${item._lastProgressPct.toFixed(1)}%`; renderUploadQueue(); } };
              xhr.onload=()=>{
                item._xhr=null; if(currentTempUploadItem===item) currentTempUploadItem=null;
                let j={}; const raw=String(xhr.responseText||'');
                try{j=JSON.parse(raw||'{}')}catch(e){return reject(Object.assign(new Error(`Upload chunk raw lỗi (HTTP ${xhr.status})`),{status:xhr.status}))}
                if(xhr.status<200 || xhr.status>=300 || j.status!=='success'){
                  const details=(j&&j.errors&&typeof j.errors==='object')?Object.values(j.errors).flat().join(' • '):'';
                  const msg=((j.message||'').toLowerCase().includes('given data was invalid')&&details)?details:(j.message||details||`Upload chunk raw lỗi (HTTP ${xhr.status})`);
                  return reject(Object.assign(new Error(msg),{status:xhr.status}));
                }
                resolve(j);
              };
              xhr.onerror=()=>{item._xhr=null; if(currentTempUploadItem===item) currentTempUploadItem=null; reject(Object.assign(new Error('Lỗi mạng upload chunk'),{status:0}))};
              xhr.ontimeout=()=>{item._xhr=null; if(currentTempUploadItem===item) currentTempUploadItem=null; reject(Object.assign(new Error('Chunk timeout, anh retry để resume tiếp'),{status:408}))};
              xhr.onabort=()=>{item._xhr=null; if(currentTempUploadItem===item) currentTempUploadItem=null; reject(Object.assign(new Error('Đã huỷ upload tạm'),{status:499}))};
              xhr.send(blob);
            });
            sent=true;
          }catch(err){
            lastErr=String(err?.message||'Lỗi upload chunk');
            lastStatus=Number(err?.status||0);
            if(cancelCurrentItemRequested || /đã huỷ/i.test(lastErr)){
              throw new Error('Đã huỷ upload tạm');
            }
            if(Number(err?.status||0)===422 && chunkShrinkCount<2 && currentChunkSize>(2*1024*1024)){
              currentChunkSize=Math.max(2*1024*1024, Math.floor(currentChunkSize/2));
              chunkShrinkCount++;
              item.status=`đang giảm chunk còn ${Math.round(currentChunkSize/1024/1024)}MB để retry...`;
              renderUploadQueue();
            }
            if(/offset không khớp|resume/i.test(lastErr)){
              try{
                const st=await apiJson(`${uploadApi}/queue/upload-temp-status/${encodeURIComponent(token)}`);
                uploaded=Math.max(0,Math.min(total,Number(st?.data?.received||0)));
                start=uploaded;
                end=Math.min(total,start+currentChunkSize);
              }catch(e){}
            }
            if(attempt<3) await new Promise(r=>setTimeout(r, 600*attempt));
          }
        }
        if(!sent){
          if(lastStatus===422){
            throw new Error(lastErr||'Resume token không hợp lệ (422). Chọn lại file để resume hoặc upload mới.');
          }
          throw new Error(lastErr||'Upload chunk thất bại sau nhiều lần thử');
        }
        uploaded=end;
        start=end;
        item.resumeToken=token;
        persistUploadQueue();
        const pct=Math.max(0,Math.min(100,(uploaded/total)*100));
        item._lastProgressPct=Math.max(Number(item._lastProgressPct||0), pct);
        item.status=`đang upload ${item._lastProgressPct.toFixed(1)}%`;
        renderUploadQueue();
      }

      item.status='đang hoàn tất upload tạm...';
      renderUploadQueue();
      const fdDone=new FormData();
      fdDone.append('token',token);
      if(item.subtitleFileObj) fdDone.append('subtitle_file',item.subtitleFileObj);
      const done=await apiJson(`${uploadApi}/queue/upload-temp-complete`,{method:'POST',body:fdDone});
      item.token=done?.data?.token||token;
      item.resumeToken='';
      item._lastProgressPct=100;
      item.tempFile=done?.data?.temp_file||'';
      item.size=Number(done?.data?.size||item.size||0);
      item.subtitleFile=String(done?.data?.subtitle_file||item.subtitleFile||'');
      item.subtitleName=String(done?.data?.subtitle_name||item.subtitleName||'');
      return done;
    }

    async function runUploadQueue(){
      if(uploadQueueRunning){
        const stillProcessing=(currentQueueIndex>=0) || uploadQueue.some(x=>{const s=String(x?.status||''); return s==='đang chạy'||s.startsWith('đang upload')||s.startsWith('đang khởi tạo')||s.startsWith('đang hoàn tất');});
        if(stillProcessing) return;
        uploadQueueRunning=false;
      }
      uploadQueueRunning=true;
      try{
        const modes=getSelectedStorageModes();
        for(let i=0;i<uploadQueue.length;i++){
          const it=uploadQueue[i];
          if(!it) continue;
          if(Number(it.doneAt||0)>0) continue;
          if(!(it.status==='chờ' || it.status==='đã upload' || it.status==='chờ xử lý')) continue;
          currentQueueFileName=it.name||'';
          setRunningQueueIndex(i);

          if((it.status==='chờ') && it.file && !it.token){
            it.error='';
            it.status='đang upload 0%';
            renderUploadQueue();
            await uploadQueueTempItem(it);
            it.status='đã upload';
            renderUploadQueue();
            persistUploadQueue();
          }

          const payload=collectQueueProcessPayload(it,modes);
          if(!(payload.storage_mode_overrides||[]).length) throw new Error('Anh chọn ít nhất 1 sever lưu');
          if(payload.keep_original && !(payload.original_storage_overrides||[]).length) throw new Error('Anh chọn 1 storage lưu file gốc');
          let rs;
          try{
            rs=await apiJson(`${uploadApi}/queue/process-temp`,{method:'POST',body:JSON.stringify(payload)});
          }catch(e){
            const msg=String(e?.message||'');
            if(msg.includes('Không tìm thấy file tạm') && it?.file){
              it.status='đang upload lại file tạm...';
              renderUploadQueue();
              await uploadQueueTempItem(it);
              const payloadRetry=collectQueueProcessPayload(it,modes);
              rs=await apiJson(`${uploadApi}/queue/process-temp`,{method:'POST',body:JSON.stringify(payloadRetry)});
            }else if(msg.includes('Không tìm thấy file tạm') && !it?.file){
              it.status='lỗi';
              it.error='Token tạm đã hết hạn (cần chọn lại file để upload lại)';
              it.doneAt=Date.now();
              renderUploadQueue();
              continue;
            }else{
              throw e;
            }
          }
          const jobId=rs?.data?.job_id;
          if(!jobId) throw new Error('Không tạo được job xử lý');
          it.jobId=jobId;
          const final=await pollJobStatus(jobId,currentQueueFileName);
          const st=String(final?.status||'').toLowerCase();
          if(st==='success') { it.status='xong'; it.doneAt=Date.now(); }
          else if(st==='cancelled'){ it.status='đã huỷ'; it.doneAt=Date.now(); if(it.token) try{await apiJson(`${uploadApi}/queue/temp/${it.token}`,{method:'DELETE'})}catch(e){} }
          else { it.status='lỗi'; it.error='Lỗi xử lý'; it.doneAt=Date.now(); }
          renderUploadQueue();
        }
        currentQueueIndex=-1; currentQueueFileName='';
      }catch(e){
        const cur=(currentQueueIndex>=0?uploadQueue[currentQueueIndex]:null);
        if(cancelCurrentItemRequested){
          if(cur) {cur.status='đã huỷ'; cur.doneAt=Date.now();}
          cancelCurrentItemRequested=false;
          renderUploadQueue();
          log('Đã bỏ qua video hiện tại, chuyển video tiếp theo');
        }else{
          if(cur) {cur.status='lỗi'; cur.error=e.message||'Lỗi'; cur.doneAt=Date.now();}
          renderUploadQueue();
          saveActiveJob('');
          log('Queue lỗi: '+e.message);
          showBgBadge('❌ Queue lỗi',e.message||'',0); hideBgBadge(5000);
          alert(e.message);
        }
      }finally{uploadQueueRunning=false; persistUploadQueue(); if(uploadQueue.some(x=>Number(x?.doneAt||0)<=0 && (x.status==='chờ' || x.status==='đã upload' || x.status==='chờ xử lý'))) setTimeout(()=>runUploadQueue(),100);}
    }


    async function importVideo(){
      try{
        const modes=getSelectedStorageModes(); if(!modes.length) return alert('Anh chọn ít nhất 1 sever lưu');
        const jobId='job_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);
        saveActiveJob(jobId);
        const orig=(isKeepOriginal()&&val('original_storage_mode'))?[val('original_storage_mode')]:[]; if(isKeepOriginal() && !orig.length) throw new Error('Anh chọn 1 storage lưu file gốc');
        await apiJson(`${api}/videos/import`,{method:'POST',body:JSON.stringify({import_link:$('import_link').value.trim(),import_title:$('import_title').value.trim(),enable_hls:$('enable_hls').value==='1',hls_quality:getSelectedQuality(),keep_original:isKeepOriginal(),original_storage_overrides:orig,create_thumbnail:isCreateThumbnail(),encrypt_hls:isEncryptHls(),rename_segment:isRenameSegment(),storage_mode_overrides:modes,category:val('video_category')||'',subtitle_file:'',subtitle_name:'',upload_job_id:jobId})});
        setUploadProgress(5,'Đã nhận job','Đang chờ worker xử lý...');
        log('Import đã vào hàng xử lý'); showBgBadge('Đã đưa vào hàng xử lý nền...','Job đã tạo thành công',5); pollJobStatus(jobId);
      }catch(e){saveActiveJob(''); log('Import lỗi: '+e.message); alert(e.message)}
    }

    function uploadWithProgress(url,fd){
      return new Promise((ok,fail)=>{const x=new XMLHttpRequest(); currentUploadXhr=x; x.open('POST',url,true);
        x.upload.onprogress=e=>{if(e.lengthComputable){const p=e.loaded/e.total*100; const up=formatBytes(e.loaded), tot=formatBytes(e.total); setUploadProgress(p,`${p.toFixed(1)}% (đang upload)`,`${up} / ${tot}`); showBgBadge(`Đang upload: ${p.toFixed(1)}%`,`${up} / ${tot}`,p)}};
        x.onload=()=>{currentUploadXhr=null; const raw=x.responseText||''; try{const j=JSON.parse(raw); if(x.status>=200&&x.status<300) ok(j); else fail(new Error(j.message||`HTTP ${x.status}`))}catch{fail(new Error(raw.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,300)||'Server lỗi'))}};
        x.onerror=()=>{currentUploadXhr=null; fail(new Error('Lỗi mạng upload'))};
        x.onabort=()=>{currentUploadXhr=null; fail(new Error('Đã huỷ upload'))};
        x.send(fd);
      })
    }

    async function uploadVideo(){
      const files=[...($('upload_file').files||[])];
      if(!files.length) return alert('Anh chọn file trước');
      const subtitleEnabled=isSubtitleMode();
      const subtitleObj=$('subtitle_file')?.files?.[0]||null;
      if(subtitleEnabled && !subtitleObj) return alert('Anh chọn file subtitle trước khi upload.');
      const snap=captureCurrentUploadConfig(); const rows=files.map(f=>({id:'q_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),file:f,name:f.name,size:f.size,status:'đang upload 0%',jobId:'',token:'',error:'',subtitleFile:'',subtitleName:'',subtitleFileObj:(subtitleEnabled?subtitleObj:null),config:JSON.parse(JSON.stringify(snap))}));
      uploadQueue.push(...rows);
      renderUploadQueue(); persistUploadQueue();
      log(`Đã thêm ${files.length} file vào hàng chờ`);
      for(let idx=0; idx<rows.length; idx++){
        const it=rows[idx];
        try{
          setUploadProgress(5,'Đang upload file lên server...',`File ${idx+1}/${rows.length}: ${it.name}`);
          await uploadQueueTempItem(it);
          it.status='chờ xử lý';
        }catch(e){
          const msg=String(e?.message||'Upload tạm lỗi');
          if(cancelCurrentItemRequested || msg.includes('Đã huỷ upload tạm')){
            it.status='đã huỷ';
            it.error='Đã huỷ upload tạm';
            cancelCurrentItemRequested=false;
          }else{
            it.status='lỗi';
            it.error=msg;
          }
        }
        renderUploadQueue(); persistUploadQueue();
      }
      setUploadProgress(15,'Upload tạm hoàn tất','Đang xử lý tuần tự từng video...');
      await runUploadQueue();
    }


    function updateSelectedDeleteButton(){
      const btn=$('btnDeleteSelected');
      const btnMulti=$('btnMultiEmbedSelected');
      const n=selectedVideoIds.size;
      if(btn){
        btn.disabled=n===0;
        btn.textContent=currentLang==='en'?`Delete selected (${n})`:`Xoá đã chọn (${n})`;
      }
      if(btnMulti){
        btnMulti.disabled=n<2;
        btnMulti.textContent=`Embed multi server (${n})`;
      }
      const all=$('video_select_all');
      const items=[...document.querySelectorAll('.video-row-check')];
      if(all){
        const total=items.length;
        const checked=items.filter(x=>x.checked).length;
        all.checked=total>0 && checked===total;
        all.indeterminate=checked>0 && checked<total;
      }
    }
    function toggleVideoSelection(id,checked){
      const key=String(id);
      if(checked) selectedVideoIds.add(key); else selectedVideoIds.delete(key);
      updateSelectedDeleteButton();
    }
    function toggleSelectAllVideos(checked){
      document.querySelectorAll('.video-row-check').forEach(el=>{el.checked=checked; const id=el.getAttribute('data-id'); if(checked) selectedVideoIds.add(String(id)); else selectedVideoIds.delete(String(id));});
      updateSelectedDeleteButton();
    }
    async function deleteSelectedVideos(){
      const ids=[...selectedVideoIds];
      if(!ids.length) return;
      if(!confirm(currentLang==='en'?`Are you sure you want to delete ${ids.length} selected video(s)?`:`Anh chắc muốn xoá ${ids.length} video đã chọn?`)) return;
      ids.forEach(id=>enqueueDeleteTask(Number(id)));
      selectedVideoIds.clear();
      updateSelectedDeleteButton();
    }
    function buildMultiServerEmbedCode(sources){
      let playerType=String(val('embed_player_type')||'native').toLowerCase(); if(playerType==='custom_jw') playerType='custom';
      const useCustomPlayer=(playerType==='custom');
      const safeSources=(sources||[]).filter(s=>s&&(s.url||s.embed_url)).map(s=>({label:String(s.label||'Server'),url:String(s.url||''),embed_url:String(s.embed_url||''),subtitle:String(s.subtitle||''),subtitle_fallback:String(s.subtitle_fallback||'')}));
      const json=JSON.stringify(safeSources).replace(/<\//g,'<\/');
      const positionPreset=String(val('multi_server_list_position')||'outside-bottom-center').toLowerCase();
      const effectivePos=useCustomPlayer?'outside-bottom-center':positionPreset;
      const playerBlock='<div id="vv-multi-wrap" class="vv-multi-player" style="position:relative;width:100%;aspect-ratio:16/9;background:#000;overflow:hidden;border-radius:10px">';
      const serverBlock='<div id="vv-multi-switch" class="vv-multi-server-list" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"></div>';
      let shellStart='';
      let shellMid='';
      let shellEnd='';
      if(effectivePos==='inside-left' || effectivePos==='inside-right'){
        const side=(effectivePos==='inside-left')?'left:10px;right:auto;':'right:10px;left:auto;';
        shellStart='<div class="vv-multi-shell" style="display:block;width:100%;max-width:100%">'+playerBlock;
        shellMid='</div><div id="vv-multi-switch" class="vv-multi-server-list" style="position:absolute;top:10px;'+side+'display:flex;flex-direction:column;gap:8px;align-items:flex-start;z-index:6"></div>';
        shellEnd='</div>';
      }else if(effectivePos==='outside-top-left' || effectivePos==='outside-top-center' || effectivePos==='outside-top-right'){
        const jc=effectivePos.endsWith('left')?'flex-start':(effectivePos.endsWith('right')?'flex-end':'center');
        shellStart='<div class="vv-multi-shell" style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:100%"><div id="vv-multi-switch" class="vv-multi-server-list" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:'+jc+'"></div>'+playerBlock;
        shellMid='';
        shellEnd='</div></div>';
      }else{
        const jc=effectivePos==='outside-bottom-left'?'flex-start':(effectivePos==='outside-bottom-right'?'flex-end':'center');
        shellStart='<div class="vv-multi-shell" style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:100%">'+playerBlock;
        shellMid='</div><div id="vv-multi-switch" class="vv-multi-server-list" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:'+jc+'"></div>';
        shellEnd='</div>';
      }
      const extraCss=JSON.stringify(String(val('multi_server_list_css')||''));
      const extraJs=JSON.stringify(String(val('multi_server_list_js')||''));
      const commonButtons = `function renderButtons(setSrc){sources.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('data-srv','1');b.className='vv-multi-server-btn';b.textContent=s.label||('Server '+(i+1));b.style.cssText='border:1px solid rgba(148,163,184,.25);background:#0f172a;color:#e5e7eb;padding:8px 12px;border-radius:10px;cursor:pointer;font:600 13px Arial';b.onclick=function(){setSrc(i)};sw.appendChild(b);});} function syncActive(i){Array.from(sw.querySelectorAll('button[data-srv="1"]')).forEach((b,idx)=>{if(idx===i){b.style.opacity='1';b.style.background='#2563eb';b.style.color='#fff';b.style.borderColor='#2563eb';}else{b.style.opacity='1';b.style.background='#0f172a';b.style.color='#e5e7eb';b.style.borderColor='rgba(148,163,184,.25)';}});} function applyCustom(){try{var css=${extraCss}; if(css&&String(css).trim()){var st=document.createElement('style'); st.textContent=String(css); document.head.appendChild(st);}}catch(e){} try{var js=${extraJs}; if(js&&String(js).trim()){(new Function('ctx', String(js)))({root:document.querySelector('.vv-multi-shell'), serverList:sw, getServers:function(){return sources.slice();}, setServer:function(i){setSrc(i);}});}}catch(e){console.error(e);}}`;
      if(playerType==='jwplayer'){
        return `<div class="vv-multi-shell" style="display:block;width:100%;max-width:100%"><div id="vv-jw-wrap" style="position:relative;width:100%;aspect-ratio:16/9;background:#000;overflow:hidden;border-radius:10px"><iframe id="vv-jw-frame" style="width:100%;height:100%;border:0;background:#000" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe><div id="vv-multi-switch" class="vv-multi-server-list" style="position:absolute;top:10px;right:10px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:flex-end;z-index:20"></div></div></div><script>(function(){const sources=${json};const sw=document.getElementById('vv-multi-switch');const frame=document.getElementById('vv-jw-frame');if(!sources.length||!sw||!frame)return;let currentIndex=0,lastFallbackFrom=-1,switching=false,resumeAt=0;function syncActive(i){Array.from(sw.querySelectorAll('button[data-srv="1"]')).forEach((b,idx)=>{if(idx===i){b.style.background='#2563eb';b.style.color='#fff';b.style.borderColor='#2563eb';}else{b.style.background='#0f172a';b.style.color='#e5e7eb';b.style.borderColor='rgba(148,163,184,.25)';}});}function renderButtons(){sw.innerHTML='';if(sources.length<=1){sw.style.display='none';return;}sw.style.display='flex';sources.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('data-srv','1');b.className='vv-multi-server-btn';b.textContent=s.label||('Server '+(i+1));b.style.cssText='border:1px solid rgba(148,163,184,.25);background:#0f172a;color:#e5e7eb;padding:8px 12px;border-radius:10px;cursor:pointer;font:600 13px Arial';b.onclick=function(){setSrc(i,true)};sw.appendChild(b);});}function withQuery(url,key,val){try{const u=new URL(String(url||''),location.origin);u.searchParams.set(key,val);return u.toString();}catch(e){const s=String(url||'');return s+(s.includes('?')?'&':'?')+key+'='+encodeURIComponent(val);}}function pickEmbed(i){const s=sources[i]||{};let url=String(s.embed_url||s.url||'').trim();if(!url)return'';url=withQuery(url,'autoplay','1');if(resumeAt>0)url=withQuery(url,'start',String(Math.floor(resumeAt)));return url;}function setSrc(i,manual){const s=sources[i]||{};if(!s.url&&!s.embed_url)return;currentIndex=i;syncActive(i);frame.src=pickEmbed(i);}window.addEventListener('message',function(ev){try{const d=ev&&ev.data?ev.data:null;if(d&&d.type==='vv-time'&&Number.isFinite(Number(d.time))){resumeAt=Math.max(0,Number(d.time)||0);}}catch(e){}});frame.addEventListener('load',function(){switching=false;});frame.addEventListener('error',function(){if(switching||lastFallbackFrom===currentIndex)return;const n=currentIndex+1;if(n<sources.length){lastFallbackFrom=currentIndex;switching=true;setSrc(n,false);}});renderButtons();setSrc(0,false);})();<\/script>`;
      }
      if(useCustomPlayer){
        const customHtml=JSON.stringify(String(val('embed_custom_html')||'').trim());
        const customCss=JSON.stringify(String(val('embed_custom_css')||''));
        const customJs=JSON.stringify(String(val('embed_custom_js')||''));
        return `<div class="vv-multi-shell" style="display:block;width:100%;max-width:100%"><div id="vv-multi-wrap" class="vv-multi-player" style="position:relative;width:100%;aspect-ratio:16/9;background:#000;overflow:hidden;border-radius:10px"><iframe id="vv-multi-frame" style="width:100%;height:100%;border:0;background:#000" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div></div><script>(function(){const sources=${json};const f=document.getElementById('vv-multi-frame');if(!f||!sources.length)return;const tplHtml=${customHtml};const tplCss=${customCss};const tplJs=${customJs};function escHtml(s){return String(s||'').replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]||c;});}function deriveSubUrl(url){try{const s=String(url||'').trim();if(!s)return'';const qm=s.indexOf('?');const base=qm>=0?s.slice(0,qm):s;const qs=qm>=0?s.slice(qm):'';if(!base.toLowerCase().endsWith('/master.m3u8'))return'';return base.slice(0,-'/master.m3u8'.length)+'/sub_vi.vtt'+qs;}catch(e){return'';}}function renderCustom(i){const s=sources[i]||sources[0]||{};const src=String(s.url||'').trim();if(!tplHtml){f.src=s.embed_url||src||'';return;}const repl={ '{{SRC}}':src, '{{SUB_URL}}':deriveSubUrl(src), '{{TITLE}}':String(s.label||('Server #'+(i+1))), '{{MULTI_SOURCES_JSON}}':JSON.stringify(sources), '{{MULTI_CURRENT_INDEX}}':String(i), '{{MULTI_CURRENT_LABEL}}':String(s.label||('Server #'+(i+1))) };let h=tplHtml,c=tplCss,j=tplJs;Object.keys(repl).forEach(function(k){h=h.split(k).join(repl[k]); c=c.split(k).join(repl[k]); j=j.split(k).join(repl[k]);});const doc='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:#000;height:100%}'+c+'</style></head><body>'+h+'<script>(function(){try{'+j+'}catch(e){console.error(e);}})();<\\/script></body></html>';f.srcdoc=doc;}renderCustom(0);})();<\/script>`;
      }
      return `${shellStart}<video id="vv-multi-v" controls playsinline webkit-playsinline style="width:100%;height:100%;background:#000"><track id="vv-multi-track" kind="subtitles" srclang="vi" label="Sub" default></video>${shellMid}${shellEnd}<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"><\/script><script>(function(){const sources=${json};const v=document.getElementById('vv-multi-v');const sw=document.getElementById('vv-multi-switch');const tr=document.getElementById('vv-multi-track');if(!v||!sources.length)return;let h=null;let resumeAt=0;let resumePlay=false;let currentIndex=0;let switching=false;let lastFallbackFrom=-1;let sourceToken=0;let autoFallbackUsed=false;function deriveSubUrl(url){try{const s=String(url||'').trim();if(!s)return'';const qm=s.indexOf('?');const base=qm>=0?s.slice(0,qm):s;const qs=qm>=0?s.slice(qm):'';if(!base.toLowerCase().endsWith('/master.m3u8'))return'';return base.slice(0,-'/master.m3u8'.length)+'/sub_vi.vtt'+qs;}catch(e){return'';}}function ensureTrackShowing(){try{const tt=v&&v.textTracks?v.textTracks:null;if(!tt)return;for(let i=0;i<tt.length;i++){if(tt[i])tt[i].mode=(i===0?'showing':'hidden');}}catch(e){}}function syncTrack(url){try{const subUrl=deriveSubUrl(url);if(tr){tr.src=subUrl||'';tr.default=!!subUrl;}}catch(e){}setTimeout(ensureTrackShowing,150);setTimeout(ensureTrackShowing,600);setTimeout(ensureTrackShowing,1200);}function applyResume(){try{if(Number.isFinite(resumeAt)&&resumeAt>0)v.currentTime=resumeAt;}catch(e){} if(resumePlay){const p=v.play(); if(p&&typeof p.catch==='function')p.catch(()=>{});} }function tryFallback(fromIdx,token){if(token!=null && token!==sourceToken)return;if(autoFallbackUsed||switching||lastFallbackFrom===fromIdx)return;const next=fromIdx+1;if(next>=sources.length)return;autoFallbackUsed=true;lastFallbackFrom=fromIdx;switching=true;setSrc(next);setTimeout(function(){switching=false;},1200);} ${commonButtons}function setSrc(i){const s=sources[i];if(!s)return;currentIndex=i;sourceToken++;const token=sourceToken;if(i!==lastFallbackFrom) lastFallbackFrom=-1;try{resumeAt=Number(v.currentTime||0);}catch(e){resumeAt=0;} resumePlay=!v.paused; syncTrack(s.url); if(h){try{h.destroy()}catch(e){}h=null;}if(v&&v.canPlayType('application/vnd.apple.mpegurl')){v.src=s.url;v.onloadedmetadata=function(){if(token!==sourceToken)return;applyResume(); ensureTrackShowing();};setTimeout(ensureTrackShowing,1200);}else if(v&&window.Hls&&Hls.isSupported()){h=new Hls({});h.subtitleDisplay=true;h.loadSource(s.url);h.attachMedia(v);h.on(Hls.Events.MANIFEST_PARSED,function(){if(token!==sourceToken)return;try{if((h.subtitleTracks||[]).length>0){h.subtitleTrack=0;}}catch(e){}applyResume();setTimeout(ensureTrackShowing,200);setTimeout(ensureTrackShowing,1200);});h.on(Hls.Events.ERROR,function(evt,data){if(token!==sourceToken)return; if(!data||!data.fatal) return; const t=String(data.type||''); if(t==='networkError'||t==='otherError') tryFallback(currentIndex,token);});h.on(Hls.Events.SUBTITLE_TRACK_SWITCH,function(){setTimeout(ensureTrackShowing,100);});}else if(v){v.src=s.url;v.onloadedmetadata=function(){if(token!==sourceToken)return;applyResume(); ensureTrackShowing();};setTimeout(ensureTrackShowing,1200);}syncActive(i);}if(v){v.addEventListener('error',function(){tryFallback(currentIndex,sourceToken);});}renderButtons(setSrc);setSrc(0);applyCustom();})();<\/script>`;
    }
    function rebuildMultiEmbedPreview(selectedHost=''){
      const host=String(selectedHost||'').trim();
      const forceMute=!!($('multiIframeMuteToggle')?.checked);
      const forceAutoplay=!!($('multiIframeAutoplayToggle')?.checked);
      const withParams=(url)=>{ try{ const u=new URL(String(url||''), location.origin); if(forceMute) u.searchParams.set('mute','1'); else u.searchParams.delete('mute'); if(forceAutoplay) u.searchParams.set('autoplay','1'); else u.searchParams.delete('autoplay'); return u.toString(); }catch(e){ return String(url||''); } };
      const sources=(currentMultiEmbedSources||[]).map((s,idx)=>({label:String(s.label||`SERVER #${idx+1}`),url:withParams(applyHostToPlayUrl(String(s.url||''), host)),embed_url:withParams(applyHostToPlayUrl(String(s.embed_url||''), host)),subtitle:String(s.subtitle||''),subtitle_fallback:String(s.subtitle_fallback||'')})).filter(x=>x.url);
      const code=buildMultiServerEmbedCode(sources);
      if($('multiIframeCode')) $('multiIframeCode').value=code;
      if($('multiIframeCodeFull')) $('multiIframeCodeFull').value=code;
      if($('multiEmbedUrlList')) $('multiEmbedUrlList').value=sources.map((s,idx)=>`${s.label||('Server #'+(idx+1))}: ${s.embed_url||''}`).join('\n');
      if($('multiPlayUrlList')) $('multiPlayUrlList').value=sources.map((s,idx)=>`${s.label||('Server #'+(idx+1))}: ${s.url||''}`).join('\n');
      const f=$('multiPlayerEmbedFrame');
      if(f){
        try{ f.removeAttribute('src'); }catch(e){}
        f.srcdoc=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:#000}</style></head><body>${code}</body></html>`;
      }
    }
    function openMultiEmbedModal(){ $('playerModal')?.classList.remove('show'); $('multiEmbedModal')?.classList.add('show') }
    function closeMultiEmbedModal(){ const f=$('multiPlayerEmbedFrame'); if(f){ try{f.srcdoc='';}catch(e){} try{f.removeAttribute('src');}catch(e){} f.src='about:blank'; } $('multiEmbedModal')?.classList.remove('show') }
    function copyMultiIframeCode(){copyText($('multiIframeCode')?.value||'')}
    function copyMultiFullEmbedCode(){copyText($('multiIframeCodeFull')?.value||$('multiIframeCode')?.value||'')}
    function refreshMultiEmbedHostSelection(){ const host=($('multiEmbedHostSelect')?.value||'').trim(); rebuildMultiEmbedPreview(host); }
    async function openMultiEmbedSelected(){
      const ids=[...selectedVideoIds];
      if(ids.length<2) return alert('Anh chọn ít nhất 2 video để tạo embed multi server.');
      const map=new Map((currentVideoList||[]).map(v=>[String(v.id),v]));
      const picked=ids.map(id=>map.get(String(id))).filter(Boolean);
      const host=($('multiEmbedHostSelect')?.value||'').trim();
      const sources=[];
      for(let idx=0; idx<picked.length; idx++){
        const v=picked[idx];
        const play=v.hls_enabled&&v.hls_playlist?(String(v.hls_playlist).startsWith('http')?String(v.hls_playlist):`${location.origin}/${String(v.hls_playlist).replace(/^\/+/, '')}`):(v.webViewLink||'');
        let embedUrl='';
        try{
          const ers=await apiJson(host?`${api}/videos/${v.id}/embed?host=${encodeURIComponent(host)}`:`${api}/videos/${v.id}/embed`);
          embedUrl=String(ers?.data?.embed_url||'').trim();
        }catch(e){}
        let subtitleFallback='';
        let subtitleUrl='';
        try{
          const pp=String(play||'').trim();
          const q=pp.indexOf('?');
          const base=q>=0?pp.slice(0,q):pp;
          const qs=q>=0?pp.slice(q):'';
          if(base.toLowerCase().endsWith('/master.m3u8')) subtitleUrl=base.slice(0,-'/master.m3u8'.length)+'/sub_vi.vtt'+qs;
        }catch(e){}
        if(!subtitleUrl){
          try{
            const hp=String(v.hls_playlist||'').trim();
            if(hp){
              const abs=hp.startsWith('http')?hp:`${location.origin}/${hp.replace(/^\/+/, '')}`;
              const q2=abs.indexOf('?');
              const b2=q2>=0?abs.slice(0,q2):abs;
              const qs2=q2>=0?abs.slice(q2):'';
              if(b2.toLowerCase().endsWith('/master.m3u8')) subtitleUrl=b2.slice(0,-'/master.m3u8'.length)+'/sub_vi.vtt'+qs2;
            }
          }catch(e){}
        }
        if(play || embedUrl) sources.push({label:`Server #${idx+1}`,url:play,embed_url:embedUrl,subtitle:subtitleUrl,subtitle_fallback:''});
      }
      currentMultiEmbedSources=sources;
      if(currentMultiEmbedSources.length<2) return alert('Các video đã chọn chưa đủ link play hợp lệ.');
      openMultiEmbedModal();
      fillEmbedHostOptions(host, 'multiEmbedHostSelect');
      rebuildMultiEmbedPreview(($('multiEmbedHostSelect')?.value||''));
    }





    function detectPage(){
      const p=location.pathname.replace(/\/+$/,'');
      if(p.endsWith('/app/import')) return 'import';
      if(p.endsWith('/app/history')) return 'history';
      if(p.endsWith('/app/library')) return 'library';
      if(p.endsWith('/app/settings') || p.endsWith('/app/storage')) return 'settings';
      if(p.endsWith('/app/config')) return 'config';
      if(p.endsWith('/app/account')) return 'account';
      return 'overview';
    }




    const sideEl=document.querySelector('.side');
    const sideLogo=document.querySelector('.side .logo');
    function syncMobileMenu(){
      if(!sideEl) return;
      if(window.innerWidth<=1100){
        if(!sideEl.classList.contains('menu-open')) sideEl.classList.remove('menu-open');
      }else{
        sideEl.classList.add('menu-open');
      }
    }
    sideLogo?.addEventListener('click',()=>{if(window.innerWidth<=1100) sideEl?.classList.toggle('menu-open')});
    window.addEventListener('resize',syncMobileMenu);
    applyDarkMode(localStorage.getItem('hls_dark_mode')==='1');
    syncMobileMenu();
