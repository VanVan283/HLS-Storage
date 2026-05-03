let currentVideoPage=1;
    function renderVideoPagination(meta){
      const el=$('videoPagination'); if(!el) return;
      const current=Number(meta?.current_page||1), last=Math.max(1, Number(meta?.last_page||1)), total=Number(meta?.total||0);
      if(last<=1){ el.innerHTML=''; return; }
      const pages=[];
      const start=Math.max(1,current-2), end=Math.min(last,current+2);
      pages.push(`<button type="button" ${current<=1?'disabled':''} onclick="loadVideos(${current-1})">${currentLang==='en'?'‹ Previous':'‹ Trước'}</button>`);
      if(start>1) pages.push(`<button type="button" onclick="loadVideos(1)">1</button>`);
      if(start>2) pages.push('<span class="meta">...</span>');
      for(let p=start;p<=end;p++) pages.push(`<button type="button" class="${p===current?'active':''}" onclick="loadVideos(${p})">${p}</button>`);
      if(end<last-1) pages.push('<span class="meta">...</span>');
      if(end<last) pages.push(`<button type="button" onclick="loadVideos(${last})">${last}</button>`);
      pages.push(`<button type="button" ${current>=last?'disabled':''} onclick="loadVideos(${current+1})">${currentLang==='en'?'Next ›':'Sau ›'}</button>`);
      pages.push(`<span class="meta">${currentLang==='en'?'Page':'Trang'} ${current}/${last} • ${total} ${currentLang==='en'?'video(s)':'video'}</span>`);
      el.innerHTML=pages.join('');
    }
    async function loadVideos(page=1){
      try{
        currentVideoPage=Math.max(1, Number(page||1));
        const q=new URLSearchParams({per_page:'20',page:String(currentVideoPage)}); if(val('filter_category')) q.set('category',val('filter_category')); if(val('filter_mode')) q.set('mode',val('filter_mode')); if(val('filter_hls')) q.set('hls',val('filter_hls')); if(val('filter_account')) q.set('account',val('filter_account')); if(val('filter_from')) q.set('from',val('filter_from')); if(val('filter_to')) q.set('to',val('filter_to')); const rs=await apiJson(`${api}/videos?${q.toString()}`); const list=Array.isArray(rs?.data)?rs.data:(Array.isArray(rs?.data?.data)?rs.data.data:[]); const root=$('videoList');
        const hlsCount=list.filter(v=>v.hls_enabled&&v.hls_playlist).length;
        currentVideoList=list;
        const totalVideos=Number(rs?.total ?? rs?.data?.total ?? list.length);
        if($('stat-videos')) $('stat-videos').textContent=String(totalVideos);
        if($('ov-videos')) $('ov-videos').textContent=String(totalVideos);
        if($('ov-hls')) $('ov-hls').textContent=String(hlsCount);
        if(!list.length){selectedVideoIds.clear(); root.innerHTML='<div class="video-row video-grid-9"><div></div><div class="muted">Chưa có video.</div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'; renderVideoPagination(rs); updateSelectedDeleteButton(); return;}
        const validIds=new Set(list.map(v=>String(v.id)));
        selectedVideoIds=new Set([...selectedVideoIds].filter(id=>validIds.has(String(id))));
        root.innerHTML=list.map(v=>{const play=v.hls_enabled&&v.hls_playlist?(v.hls_playlist.startsWith('http')?v.hls_playlist:`${location.origin}/${v.hls_playlist.replace(/^\/+/, '')}`):(`${location.origin}/api/play-id/${v.id}`); const thumb=v.thumbnail?`${location.origin}/api/videos/${v.id}/thumbnail`:''; const checked=selectedVideoIds.has(String(v.id))?'checked':''; const hasSubtitle=(v.has_subtitle===true||v.has_subtitle===1||String(v.has_subtitle||'').toLowerCase()==='true'); return `<div class='video-row video-grid-9'><div class='video-col'><input class='video-row-check' data-id='${v.id}' type='checkbox' ${checked} onchange='toggleVideoSelection(${v.id}, this.checked)' /></div><div class='video-main'><div class='video-thumb'>${thumb?`<img src="${thumb}" alt="thumb">`:'🎬'}</div><div style='min-width:0'><div class='video-title'>${esc(v.title||v.name||tr('Không tiêu đề','Untitled'))}</div><div class='video-meta'>ID:${v.id} • ${esc(v.name||'')}</div><div class='video-meta mobile-video-meta' style='margin-top:6px'>${v.category?`Category: ${esc(v.category)}`:'Category: -'} • ${esc(formatDuration(v.duration))} • ${esc(formatBytes(v.size))}</div><div class='video-meta mobile-video-meta'>${esc(formatDateTime(v.created_at))} • HLS: ${v.hls_enabled?tr('Có','Yes'):tr('Không','No')} • Subtitle: ${hasSubtitle?tr('Có','Yes'):tr('Không','No')}</div></div></div><div class='video-col center'>${v.category?`<span class='cat-badge'>${esc(v.category)}</span>`:'<span class="muted">-</span>'} <button class='icon-edit-btn' type='button' title='${tr('Đổi category','Change category')}' onclick="openCategoryModal(${v.id}, '${(v.category||'').replaceAll("'","\\'")}')">✏️</button></div><div class='video-col center'>${esc(formatDuration(v.duration))}</div><div class='video-col center'>${renderStorageSourceCell(v)}</div><div class='video-col center'>${esc(formatBytes(v.size))}</div><div class='video-col center'>${esc(formatDateTime(v.created_at))}</div><div class='video-col center'>${v.hls_enabled?`<span class="mini-badge ok">${tr('Có','Yes')}</span>`:`<span class="mini-badge idle">${tr('Không','No')}</span>`}</div><div class='video-col center'>${hasSubtitle?`<span class="mini-badge ok">${tr('Có','Yes')}</span>`:`<span class="mini-badge idle">${tr('Không','No')}</span>`}</div><div class='video-col center'>${renderOriginalFileCell(v)}</div><div class='video-actions'>${play?`<button class='btn-mini connect' onclick="playVideo(${v.id}, '${play.replaceAll("'","\\'")}')">Play</button>`:''}<button class='btn-mini default' onclick="showEmbed(${v.id}, '${play.replaceAll("'","\\'")}')">Embed</button><button class='btn-mini delete' onclick='deleteVideo(${v.id})'>${tr('Xóa','Delete')}</button></div></div>`}).join('');
        renderVideoPagination(rs);
        updateSelectedDeleteButton();
      }catch(e){log('Load videos lỗi: '+e.message)}
    }

    async function loadHistory(){
      try{
        const [rs,js]=await Promise.all([apiJson(`${api}/videos?per_page=100`), apiJson(`${api}/jobs/recent?limit=120`).catch(()=>({data:[]}))]);
        const list=Array.isArray(rs?.data)?rs.data:(rs?.data?.data||[]);
        const jobs=Array.isArray(js?.data)?js.data:[];
        const root=$('historyList');
        if(!root) return;

        const failJobs=jobs.filter(j=>j?.status==='error' || j?.status==='partial').slice(0,10);
        const okRecords=list.slice(0,10);
        const okCount=list.length;
        const failCount=failJobs.length;

        const summary=`<div class="log-summary"><div class="log-stat"><div class="muted">${tr('Tổng log','Total logs')}</div><div style="font-size:22px;font-weight:800">${okCount+failCount}</div></div><div class="log-stat"><div class="muted">${tr('Upload thành công','Successful uploads')}</div><div style="font-size:22px;font-weight:800;color:#166534">${okCount}</div></div><div class="log-stat"><div class="muted">${tr('Job lỗi','Failed jobs')}</div><div style="font-size:22px;font-weight:800;color:#b91c1c">${failCount}</div></div></div>`;

        const modeIcon=(m)=>{const x=String(m||'').toLowerCase(); const label=x==='gdrive'?'Google Drive':(x==='b2'?'Backblaze B2':(x==='r2'?'Cloudflare R2':(x==='ftp'?'FTP':(x==='ttb'?'TikTok':(x==='local'?'Local':String(m||'Local')))))); const icon=x==='gdrive'?'https://cdn.simpleicons.org/googledrive':(x==='b2'?'https://cdn.simpleicons.org/backblaze':(x==='r2'?'https://cdn.simpleicons.org/cloudflare':(x==='ftp'?'https://cdn.simpleicons.org/filezilla':(x==='ttb'?'https://cdn.simpleicons.org/tiktok':'https://cdn.simpleicons.org/files')))); return `<span class="platform-icon" title="${esc(label)}"><img src="${icon}" alt="${esc(label)}"></span>`};
        const trimLogText=(s,n=88)=>{const t=String(s||'').replace(/\s+/g,' ').trim(); return t.length>n?(t.slice(0,n-1)+'…'):t};
        const translateDynamicText=(txt)=>{ let out=String(txt||''); if(currentLang==='en'){ Object.entries(I18N_PHRASES_EN).forEach(([vi,en])=>{ out=out.split(vi).join(en); }); } return out; };
        const failRows=failJobs.map(j=>{const modeArr=Array.isArray(j.modes)?j.modes:[]; const modeHtml=modeArr.length?`<div style="display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap">${modeArr.map(modeIcon).join('')}</div>`:'-'; const rawErr=Object.entries(j.errors||{}).map(([m,e])=>`${m}: ${e}`).join(' • ')||j.message||'Lỗi'; const errTxt=translateDynamicText(rawErr); const fullErr=esc(errTxt); return `<div class="log-item error"><div><span class="mini-badge warn">${tr('Lỗi','Error')}</span></div><div class="video-col">${modeHtml}</div><div class="log-main" title="${fullErr}"><div class="video-title">Job #${esc(j.job_id||'-')}</div><div class="video-meta">${esc(trimLogText(errTxt,96))}</div></div><div class="video-col">${esc(formatDateTime(j.updated_at))}</div></div>`}).join('') || `<div class="muted" style="padding:10px 12px">${tr('Chưa có job lỗi.','No failed jobs.')}</div>`;

        const okRows=okRecords.map(v=>{const sub=`ID:${v.id} • ${displayHistoryAccount(v)}`; return `<div class="log-item ok"><div><span class="mini-badge ok">OK</span></div><div class="video-col">${renderStorageSourceCell(v)}</div><div class="log-main" title="${esc(sub)}"><div class="video-title">${esc(trimLogText(v.title||v.name||'Không tiêu đề',72))}</div><div class="video-meta">${esc(trimLogText(sub,96))}</div></div><div class="video-col">${esc(formatDateTime(v.created_at))}</div></div>`}).join('') || '<div class="muted" style="padding:10px 12px">Chưa có upload thành công.</div>';

        root.innerHTML = summary + `
          <div class="log-two-col">
            <div class="log-panel">
              <div class="log-panel-head"><div><div style="font-weight:800">${tr('Log lỗi','Error logs')}</div><div class="muted">${tr('Job lỗi hoặc lỗi một phần','Failed or partial jobs')}</div></div><span class="mini-badge warn">${failCount}</span></div>
              <div class="log-table-wrap">
                <div class="log-table-head"><div>${tr('Trạng thái','Status')}</div><div>${tr('Nguồn','Source')}</div><div>${tr('Nội dung','Content')}</div><div>${tr('Thời gian','Time')}</div></div>
                <div class="log-list">${failRows}</div>
              </div>
            </div>
            <div class="log-panel">
              <div class="log-panel-head"><div><div style="font-weight:800">${tr('Log thành công','Success logs')}</div><div class="muted">${tr('Video lưu thành công','Successfully saved videos')}</div></div><span class="mini-badge ok">${okCount}</span></div>
              <div class="log-table-wrap">
                <div class="log-table-head"><div>${tr('Trạng thái','Status')}</div><div>${tr('Nguồn','Source')}</div><div>${tr('Nội dung','Content')}</div><div>${tr('Thời gian','Time')}</div></div>
                <div class="log-list">${okRows}</div>
              </div>
            </div>
          </div>`;
      }catch(e){log('Load history lỗi: '+e.message)}
    }



    function displayHistoryAccount(v){const raw=(v?.storage_account||'').trim(); if(!raw) return '-'; if((v?.storage_mode||detectStorageSource(v)).toLowerCase().includes('gdrive') || (v?.storage_mode||'').toLowerCase().includes('google')){let arr=[]; try{arr=JSON.parse(val('gdrive_accounts_json')||'[]')||[]}catch(e){arr=[]} if((raw==='Google Drive'||raw==='GDrive'||raw==='Google') && arr.length===1 && arr[0]?.name) return arr[0].name; const m=raw.match(/gdrive_token[^\s]*|gdrive_token_acc\d+\.json/i); const token=m?m[0]:''; if(token){const hit=arr.find(x=>String(x?.token_file||'').trim()===token); if(hit?.name) return hit.name;} const lower=raw.toLowerCase(); const hit2=arr.find(x=>lower.includes(String(x?.token_file||'').trim().toLowerCase())); if(hit2?.name) return hit2.name;} return raw}
