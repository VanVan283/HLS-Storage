function defaultLocalPath(){ return 'storage/app/videos-local'; }
    function canUseStorageModeByLicense(mode){
      const plan=(val('license_plan')||'trial').toLowerCase();
      const key=(mode==='ttb'?'storage_ttb':(mode==='gdrive'?'storage_gdrive':(mode==='ftp'?'storage_ftp':(mode==='r2'?'storage_r2':(mode==='b2'?'storage_b2':'storage_local')))));
      return hasLicenseFeature(key, plan==='premium' || mode==='local');
    }

    function renderStorageAccountPanels(){
      ['local','ftp','r2','b2','gdrive','ttb'].forEach(mode=>{
        const root=$(mode+'_accounts_list'); if(!root) return;
        const arr=normalizePool(mode);
        const modeEnabled=(val(mode+'_mode_enabled')||'1')==='1';
        const modeAllowed=canUseStorageModeByLicense(mode);
        if(mode==='ftp') warmUsage(mode,arr,false);
        const hasSavedAccounts=arr.length>0;
        const hasUsableAccount=(mode==='local') ? true : hasSavedAccounts;
        const chipInput=document.querySelector(`.storage-chip[value='${mode}']`);
        const chip=chipInput?.closest('.storage-option');
        if(chip) chip.style.display=(modeEnabled && hasUsableAccount)?'':'none';
        if(chipInput && !(modeEnabled && hasUsableAccount)) chipInput.checked=false;
        const shouldShowPanel=modeEnabled || hasSavedAccounts;
        const panel=root.closest('.mode-panel');
        if(panel){
          panel.style.display=shouldShowPanel?'':'none';
          panel.style.opacity=modeAllowed?'1':'0.48';
          panel.style.filter=modeAllowed?'':'grayscale(0.18)';
        }
        if(!shouldShowPanel) return;
        if(!arr.length){root.innerHTML=`<div class="muted">${tr('Chưa có account.','No accounts yet.')}</div>`; return}
        const defIdx=Math.min(getDefaultIndex(mode), Math.max(0,arr.length-1));
        root.innerHTML=arr.map((acc,i)=>{const isDef=i===defIdx; const enabled=acc.enabled!==false; const rawStatus=(mode==='local')?'ok':(acc.__status||'idle'); const statusBadge=rawStatus==='ok'?`<span class="mini-badge ok">${tr('Sẵn sàng','Ready')}</span>`:(rawStatus==='fail'?`<span class="mini-badge warn">${tr('Lỗi','Error')}</span>`:`<span class="mini-badge idle">${tr('Chưa test','Not tested')}</span>`); const enableToggle=`<button class="toggle-switch ${enabled?'on':''}" type="button" onclick="setAccountEnabled('${mode}',${i})"></button>`; const icon=mode==='gdrive'?'<span class="platform-icon"><img src="https://cdn.simpleicons.org/googledrive" alt="Google Drive"></span>':(mode==='ttb'?'<span class="platform-icon"><img src="https://cdn.simpleicons.org/tiktok" alt="TikTok"></span>':(mode==='r2'?'<span class="platform-icon"><img src="https://cdn.simpleicons.org/cloudflare" alt="Cloudflare"></span>':(mode==='b2'?'<span class="platform-icon"><img src="https://cdn.simpleicons.org/backblaze" alt="Backblaze B2"></span>':(mode==='ftp'?'<span class="platform-icon"><img src="https://cdn.simpleicons.org/filezilla" alt="FTP"></span>':'<span class="platform-icon"><img src="https://cdn.simpleicons.org/files" alt="Local"></span>')))); const meta1=mode==='gdrive'?(acc.token_file||'gdrive_token.json'):(mode==='ttb'?(acc.session_profile||'-'):(mode==='r2'||mode==='b2'?(acc.bucket||'-'):(mode==='ftp'?(acc.hostname||'-'):(acc.path||'-')))); const meta2=mode==='gdrive'?(acc.mode||'mydrive'):(mode==='ttb'?(acc.raw_base_url||'-'):(mode==='r2'||mode==='b2'?(acc.endpoint||'-'):(mode==='ftp'?((acc.path||'-')+' • '+(acc.port||21)):'Local Path'))); const sub=mode==='gdrive'?'Google Drive account':(mode==='ttb'?'TikTok session account':(mode==='r2'?'Cloudflare R2 account':(mode==='b2'?'Backblaze B2 account':(mode==='ftp'?'FTP account':'Local account')))); const label1=mode==='gdrive'?'Token file':(mode==='ttb'?'Session profile':(mode==='r2'||mode==='b2'?'Bucket':(mode==='ftp'?'Host':'Path'))); const label2=mode==='gdrive'?'Mode':(mode==='ttb'?'Raw base URL':(mode==='r2'||mode==='b2'?'Endpoint':(mode==='ftp'?'Path/Port':'Type'))); const testBtn=(mode==='local')?'':`<button class="btn-mini test" type="button" onclick="testOneAccount('${mode}',${i})">Test</button>`; return `<div class="account-item ${enabled?'':'disabled'}" data-acc-idx="${i}"><div class="account-item-head"><div><div class="account-title-wrap">${icon}<div class="account-title">${esc(acc.name||('Account '+(i+1)))}</div></div><div class="account-sub">${sub}</div></div><div class="badge-row">${isDef?`<span class="mini-badge default">${tr('Mặc định','Default')}</span>`:''}${statusBadge}${enableToggle}</div></div><div class="account-meta"><div class="account-meta-item"><div class="account-meta-label">${label1}</div><div class="account-meta-value">${esc(meta1)}</div></div><div class="account-meta-item"><div class="account-meta-label">${label2}</div><div class="account-meta-value">${esc(meta2)}</div></div></div><div class="account-actions"><button class="btn-mini default" type="button" onclick="setDefaultIndex('${mode}',${i})">${tr('Mặc định','Default')}</button><button class="btn-mini soft" type="button" onclick="editAccountModal('${mode}',${i})">${tr('Sửa','Edit')}</button>${testBtn}${mode==='gdrive'?`<button class='btn-mini connect' type='button' onclick="connectOneGdrive(${i})">Connect OAuth</button>`:''}<button class="btn-mini delete" type="button" onclick="removeAccountEntry('${mode}',${i})">${tr('Xoá','Delete')}</button></div></div>`}).join('');
        if(!modeAllowed){
          [...root.querySelectorAll('.account-item')].forEach((item)=>{
            item.classList.add('disabled');
            const badgeRow=item.querySelector('.badge-row');
            if(badgeRow && !badgeRow.querySelector('.mini-badge.locked')){ badgeRow.insertAdjacentHTML('beforeend','<span class="mini-badge warn locked">Bị khoá ở Trial</span>'); }
            item.querySelectorAll('button').forEach(btn=>{ btn.disabled=true; btn.title='Storage này không được phép sử dụng ở Trial'; });
          });
        }else if(!canUseMultiAccountStorage() && mode!=='local'){
          [...root.querySelectorAll('.account-item')].forEach((item,idx)=>{
            if(idx===0 && modeEnabled) return;
            item.classList.add('disabled');
            const badgeRow=item.querySelector('.badge-row');
            if(badgeRow && !badgeRow.querySelector('.mini-badge.locked')){ badgeRow.insertAdjacentHTML('beforeend','<span class="mini-badge warn locked">Bị khoá ở Trial</span>'); }
            item.querySelectorAll('button').forEach(btn=>{ btn.disabled=true; btn.title='Nâng cấp premium để kích hoạt lại account này'; });
          });
        }
      });
      renderOriginalStorageOptions();
    }
    function canUseMultiAccountStorage(){const plan=(val('license_plan')||'trial').toLowerCase(); return hasLicenseFeature('multi_account_storage', plan==='premium');}
    function openAccountModal(mode=''){
      $('account_edit_idx').value=''; $('account_platform').value=mode||''; renderAccountFormFields(); $('accountModal')?.classList.add('show')
    }
    function closeAccountModal(){ $('accountModal')?.classList.remove('show') }
    function nextGdriveTokenFile(){
      let arr=[]; try{arr=normalizePool('gdrive')}catch(e){arr=[]}
      const used=new Set(arr.map(x=>(x?.token_file||'').trim()).filter(Boolean));
      let i=1;
      while(used.has(`gdrive_token_acc${i}.json`)) i++;
      return `gdrive_token_acc${i}.json`;
    }
    function renderAccountFormFields(data=null){
      const mode=$('account_platform').value; const root=$('account_form_fields'); if(!root) return;
      if(!mode){root.innerHTML=`<div class="muted">${tr('Chọn nền tảng để nhập thông tin account.','Select a platform to enter account details.')}</div>`; return}
      if(mode==='local'){
        root.innerHTML=`<div class="row"><div class="field"><label>${tr('Tên account','Account name')}</label><input id="acc_name" value="${esc(data?.name||'Local #1')}" /></div><div class="field"><label>${tr('Đường dẫn lưu','Storage path')}</label><input id="acc_path" value="${esc(data?.path||defaultLocalPath())}" placeholder="storage/app/videos-local" /></div></div><div class="muted" style="margin-top:8px">${tr('Để trống cũng sẽ tự dùng path mặc định tương thích Linux/Windows.','Leave blank to use the default cross-platform local path automatically.')}</div>`;
      } else if(mode==='ftp'){
        root.innerHTML=`<div class="row"><div class="field"><label>${tr('Tên account','Account name')}</label><input id="acc_name" value="${esc(data?.name||'')}" /></div><div class="field"><label>Host</label><input id="acc_hostname" value="${esc(data?.hostname||'')}" /></div></div><div class="row"><div class="field"><label>Port</label><input id="acc_port" value="${esc(String(data?.port||21))}" /></div><div class="field"><label>Path</label><input id="acc_path" value="${esc(data?.path||'')}" /></div></div><div class="row"><div class="field"><label>User</label><input id="acc_user" value="${esc(data?.user||'')}" /></div><div class="field"><label>Pass</label><input id="acc_pass" value="${esc(data?.pass||'')}" /></div></div>`;
      } else if(mode==='r2' || mode==='b2'){
        root.innerHTML=`<div class="row"><div class="field"><label>${tr('Tên account','Account name')}</label><input id="acc_name" value="${esc(data?.name||'')}" /></div><div class="field"><label>Bucket</label><input id="acc_bucket" value="${esc(data?.bucket||'')}" /></div></div><div class="row"><div class="field"><label>Key</label><input id="acc_key" value="${esc(data?.key||'')}" /></div><div class="field"><label>Secret</label><input id="acc_secret" value="${esc(data?.secret||'')}" /></div></div><div class="field"><label>Endpoint</label><input id="acc_endpoint" value="${esc(data?.endpoint||'')}" /></div>`;
      } else if(mode==='gdrive') {
        root.innerHTML=`<div class="row"><div class="field"><label>${tr('Tên account','Account name')}</label><input id="acc_name" value="${esc(data?.name||'')}" /></div><div class="field"><label>Token file</label><input id="acc_token_file" value="${esc(data?.token_file||nextGdriveTokenFile())}" /></div></div><div class="field"><label>Client ID</label><textarea id="acc_client_id">${esc(data?.client_id||'')}</textarea></div><div class="field"><label>Client Secret</label><textarea id="acc_client_secret">${esc(data?.client_secret||'')}</textarea></div><div class="row"><div class="field"><label>Redirect URI</label><input id="acc_redirect_uri" value="${esc(data?.redirect_uri||location.origin+'/api/gdrive/callback')}" /></div><div class="field"><label>Mode</label><select id="acc_mode"><option value="mydrive">mydrive</option><option value="shared">shared</option></select></div></div><div class="field"><label>Shared Drive ID</label><input id="acc_shared_drive_id" value="${esc(data?.shared_drive_id||'')}" /></div>`;
        if($('acc_mode')) $('acc_mode').value=(data?.mode||'mydrive');
      } else {
        root.innerHTML=`<div class="row"><div class="field"><label>${tr('Tên account','Account name')}</label><input id="acc_name" value="${esc(data?.name||'')}" /></div><div class="field"><label>Session profile</label><input id="acc_session_profile" value="${esc(data?.session_profile||'ttb_acc'+Date.now())}" /></div></div><div class="field"><label>Raw base URL</label><input id="acc_raw_base_url" value="${esc(data?.raw_base_url||'https://p16-sg.tiktokcdn.com/obj/')}" placeholder="https://p16-sg.tiktokcdn.com/obj/" /></div><div class="field"><label>Cookie JSON (session)</label><textarea id="acc_cookie_json" placeholder="Dán JSON cookie export từ trình duyệt...">${esc(data?.cookie_json||'')}</textarea></div>`;
      }
    }
    function collectAccountForm(){
      const mode=$('account_platform').value;
      if(mode==='local') return {name:val('acc_name')||'Local #1',path:val('acc_path')||defaultLocalPath()};
      if(mode==='ftp') return {name:val('acc_name'),hostname:val('acc_hostname'),port:Number(val('acc_port')||21),user:val('acc_user'),pass:val('acc_pass'),path:val('acc_path')};
      if(mode==='r2' || mode==='b2') return {name:val('acc_name'),bucket:val('acc_bucket'),key:val('acc_key'),secret:val('acc_secret'),endpoint:val('acc_endpoint')};
      if(mode==='ttb') return {name:val('acc_name'),session_profile:val('acc_session_profile'),raw_base_url:val('acc_raw_base_url'),cookie_json:val('acc_cookie_json'),note:val('acc_note')};
      return {name:val('acc_name'),client_id:val('acc_client_id'),client_secret:val('acc_client_secret'),redirect_uri:val('acc_redirect_uri'),token_file:val('acc_token_file'),mode:val('acc_mode')||'mydrive',shared_drive_id:val('acc_shared_drive_id')};
    }
    function saveAccountFromModal(){
      const mode=$('account_platform').value; if(!mode) return alert('Chọn nền tảng trước');
      const acc=collectAccountForm();
      let arr=normalizePool(mode);
      const idxStr=$('account_edit_idx').value;
      if(!canUseMultiAccountStorage() && mode!=='local' && idxStr==='' && arr.length>=1){
        return alert('Storage này đã có account. Vui lòng nâng cấp lên premium để thêm nhiều account.');
      }
      if(mode==='gdrive'){
        const token=(acc.token_file||'').trim();
        if(!token) acc.token_file=nextGdriveTokenFile();
        const idxNow=$('account_edit_idx').value;
        const dup=arr.findIndex((x,ix)=>ix!==Number(idxNow||-1) && (x?.token_file||'').trim()===acc.token_file.trim());
        if(dup>=0) return alert('Token file đang bị trùng với account khác. Em đã chặn để khỏi ghi đè token.');
      }
      if(mode==='local') {
        if($('local_path')) $('local_path').value=acc.path||defaultLocalPath();
        renderStorageAccountPanels(); closeAccountModal(); queueAutoSave();
        return;
      }
      if(idxStr==='') {
        arr.push(acc);
      } else arr[Number(idxStr)]=acc;
      setAccounts(mode,arr); renderStorageAccountPanels(); closeAccountModal(); queueAutoSave();
    }
    function editAccountModal(mode,idx){let arr=normalizePool(mode); if(!arr[idx]) return; $('account_edit_idx').value=String(idx); $('account_platform').value=mode; renderAccountFormFields(arr[idx]); $('accountModal')?.classList.add('show')}
    function removeAccountEntry(mode,idx){let arr=normalizePool(mode); if(!arr[idx]) return; if(mode==='local') return alert('Local chỉ giữ 1 account, anh sửa trực tiếp.'); const warn='Nếu xoá account này thì những video upload trên account này sẽ không play/embed được nữa.\n\nAnh có chắc muốn xoá không?'; if(!confirm(warn)) return; arr.splice(idx,1); setAccounts(mode,arr); const def=getDefaultIndex(mode); if(def>=arr.length) setDefaultIndex(mode,Math.max(0,arr.length-1)); renderStorageAccountPanels(); queueAutoSave()}
    function setAccountEnabled(mode,idx){let arr=normalizePool(mode); if(!arr[idx]) return; arr[idx].enabled=(arr[idx].enabled===false)?true:false; setAccounts(mode,arr); renderStorageAccountPanels(); queueAutoSave()}
    async function testOneAccount(mode,idx){
      try{const arr=normalizePool(mode); const acc=arr[idx]; if(!acc) return; const rs=await apiJson(`${api}/storage/account-test`,{method:'POST',body:JSON.stringify({mode,account:acc})}); arr[idx].__status='ok'; setAccounts(mode,arr); renderStorageAccountPanels(); queueAutoSave(); alert(rs.message||'OK')}
      catch(e){const arr=normalizePool(mode); if(arr[idx]){arr[idx].__status='fail'; setAccounts(mode,arr); renderStorageAccountPanels(); queueAutoSave();} alert('Test lỗi: '+e.message)}
    }
    async function connectOneGdrive(idx){
      try{const arr=normalizePool('gdrive'); const acc=arr[idx]; if(!acc) return; const rs=await apiJson(`${api}/gdrive/account-auth-url`,{method:'POST',body:JSON.stringify({client_id:acc.client_id,client_secret:acc.client_secret,redirect_uri:acc.redirect_uri,token_file:acc.token_file||`gdrive_token_acc${idx+1}.json`})}); window.open(rs?.data?.auth_url,'_blank','width=720,height=820')}
      catch(e){alert('Connect lỗi: '+e.message)}
    }
    function showTtbSessionHelp(idx){alert('Account TikTok #' + (idx+1) + ': dán cookie JSON/session vào form account, rồi bấm Lưu.');}
    async function testAccounts(mode){
      try{const arr=normalizePool(mode); if(!arr.length) return alert('Chưa có account'); const out=[]; for(let i=0;i<arr.length;i++){try{await apiJson(`${api}/storage/account-test`,{method:'POST',body:JSON.stringify({mode,account:arr[i]})}); arr[i].__status='ok'; out.push(`#${i+1}: OK`)}catch(e){arr[i].__status='fail'; out.push(`#${i+1}: FAIL - ${e.message}`)}} setAccounts(mode,arr); renderStorageAccountPanels(); queueAutoSave(); alert(out.join('\n'))}catch(e){alert(e.message)}
    }
    function validateAccountsJson(mode){try{const arr=parseAccounts(mode); setAccounts(mode,arr); renderStorageAccountPanels(); alert(`OK: ${arr.length} account`)}catch(e){alert(`Lỗi ${mode.toUpperCase()}: ${e.message}`)}}
    async function connectGdriveAccountFromJson(){try{const arr=normalizePool('gdrive'); if(!arr.length) return alert('Chưa có account'); const idx=Number(prompt(`Chọn account số (1..${arr.length})`,`1`)||'1')-1; await connectOneGdrive(idx)}catch(e){alert('Lỗi connect account: '+e.message)}}
    async function loadAccountUsage(mode,idx){try{const arr=normalizePool(mode); const acc=arr[idx]; if(!acc) return; const rs=await apiJson(`${api}/storage/account-usage`,{method:'POST',body:JSON.stringify({mode,account:acc})}); arr[idx].__usage=rs.data||null; arr[idx].__usage_loading=false; setAccounts(mode,arr); renderStorageAccountPanels(); queueAutoSave();}catch(e){alert('Lấy dung lượng lỗi: '+e.message)}}
    async function loadPatchStatus(){
      try{
        const rs=await apiJson(`${api}/patch/status`);
        const d=rs?.data||{};
        const txt=[];
        txt.push(`Current version: ${d.current_version||'0.0.0'}`);
        if(Array.isArray(d.backups)&&d.backups.length) txt.push(`Backups: ${d.backups.slice(0,8).join(', ')}`);
        if(d.log_tail) txt.push('\n--- LOG ---\n'+String(d.log_tail));
        if($('patch_status_log')) $('patch_status_log').value=txt.join('\n');
      }catch(e){ if($('patch_status_log')) $('patch_status_log').value='Load patch status lỗi: '+e.message; }
    }
    async function runPatchDryRun(){
      try{ const feed=(val('patch_feed_url')||'').trim(); if(!feed) return alert('Anh nhập feed latest.json trước'); const rs=await apiJson(`${api}/patch/update`,{method:'POST',body:JSON.stringify({feed,dry_run:true})}); alert(rs.message||'Dry-run xong'); await loadPatchStatus(); }
      catch(e){ alert('Dry-run lỗi: '+e.message); await loadPatchStatus(); }
    }
    async function runPatchUpdateNow(){
      try{ const feed=(val('patch_feed_url')||'').trim(); if(!feed) return alert('Anh nhập feed latest.json trước'); const rs=await apiJson(`${api}/patch/update`,{method:'POST',body:JSON.stringify({feed,dry_run:false})}); alert(rs.message||'Update xong'); await loadPatchStatus(); }
      catch(e){ alert('Update lỗi: '+e.message); await loadPatchStatus(); }
    }
    async function runPatchRollbackNow(){
      try{ const rs=await apiJson(`${api}/patch/rollback`,{method:'POST',body:JSON.stringify({})}); alert(rs.message||'Rollback xong'); await loadPatchStatus(); }
      catch(e){ alert('Rollback lỗi: '+e.message); await loadPatchStatus(); }
    }
    async function testSettings(){try{const p=collectSettingsPayload(); await apiJson(`${api}/settings`,{method:'PUT',body:JSON.stringify(p)}); const rs=await apiJson(`${api}/settings/test`,{method:'POST',body:JSON.stringify({storage_mode:p.storage_mode})}); log('Test OK: '+(rs.message||'OK')); alert(rs.message||'OK')}catch(e){log('Test lỗi: '+e.message); alert(e.message)}}
    async function connectGoogleDrive(){try{const p=collectSettingsPayload(); await apiJson(`${api}/settings`,{method:'PUT',body:JSON.stringify(p)}); const rs=await apiJson(`${api}/gdrive/auth-url`); window.open(rs?.data?.auth_url,'_blank','width=720,height=820'); log('Đã mở kết nối Google Drive')}catch(e){log('Lỗi GD: '+e.message); alert(e.message)}}
    async function loadSystemStatus(){
      try{
        const rs=await apiJson(`${api}/system/status`);
        const d=rs.data||{};
        const cpuTxt=d.cpu?.usage_pct!=null?String(d.cpu.usage_pct)+'%':'--';
        const ramTxt=d.memory?.usage_pct!=null?String(d.memory.usage_pct)+'%':'--';
        if($('stat-cpu')) $('stat-cpu').textContent=cpuTxt;
        if($('stat-ram')) $('stat-ram').textContent=ramTxt;
        if($('stat-cpu-note')) $('stat-cpu-note').textContent=`Core: ${d.cpu?.cores??'-'} • Load 1m: ${d.cpu?.load_1m??'-'}`;
        if($('stat-ram-note')) $('stat-ram-note').textContent=`Used: ${formatBytes((Number(d.memory?.used_kb||0))*1024)} / ${formatBytes((Number(d.memory?.total_kb||0))*1024)}`;
        __systemStatusCache=d;
        renderFfmpegThreadsHint();
        const diskTxt=d.disk?.usage_pct!=null?String(d.disk.usage_pct)+'%':'--';
        if($('stat-disk')) $('stat-disk').textContent=diskTxt;
        if($('stat-disk-note')) $('stat-disk-note').textContent=`Used: ${formatBytes(Number(d.disk?.used_bytes||0))} / ${formatBytes(Number(d.disk?.total_bytes||0))}`;
        const toolsOk=!!(d.ffmpeg?.ok && d.ffprobe?.ok && d.ytdlp?.ok);
        if($('systemStatusBadge')) { const el=$('systemStatusBadge'); el.className=`pill ${toolsOk?'ok':'bad'}`; el.textContent=toolsOk?tr('Sẵn sàng','Ready'):tr('Cần kiểm tra','Needs attention'); }
        if($('systemStatus')) $('systemStatus').innerHTML=`
          <div style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:12px'>
            <div class='preset-summary-item' style='padding:12px 13px;background:${d.ffmpeg?.ok?'linear-gradient(180deg,rgba(236,253,245,.95),rgba(255,255,255,.98))':'linear-gradient(180deg,rgba(254,242,242,.95),rgba(255,255,255,.98))'};border-color:${d.ffmpeg?.ok?'rgba(34,197,94,.16)':'rgba(239,68,68,.16)'};box-shadow:0 8px 20px rgba(15,23,42,.05)'><div class='preset-summary-label'>FFmpeg</div><div class='preset-summary-value' style='color:${d.ffmpeg?.ok?'#166534':'#b91c1c'}'>${d.ffmpeg?.ok?'OK':'Thiếu'}</div></div>
            <div class='preset-summary-item' style='padding:12px 13px;background:${d.ffprobe?.ok?'linear-gradient(180deg,rgba(236,253,245,.95),rgba(255,255,255,.98))':'linear-gradient(180deg,rgba(254,242,242,.95),rgba(255,255,255,.98))'};border-color:${d.ffprobe?.ok?'rgba(34,197,94,.16)':'rgba(239,68,68,.16)'};box-shadow:0 8px 20px rgba(15,23,42,.05)'><div class='preset-summary-label'>FFprobe</div><div class='preset-summary-value' style='color:${d.ffprobe?.ok?'#166534':'#b91c1c'}'>${d.ffprobe?.ok?'OK':'Thiếu'}</div></div>
            <div class='preset-summary-item' style='padding:12px 13px;background:${d.ytdlp?.ok?'linear-gradient(180deg,rgba(236,253,245,.95),rgba(255,255,255,.98))':'linear-gradient(180deg,rgba(254,242,242,.95),rgba(255,255,255,.98))'};border-color:${d.ytdlp?.ok?'rgba(34,197,94,.16)':'rgba(239,68,68,.16)'};box-shadow:0 8px 20px rgba(15,23,42,.05)'><div class='preset-summary-label'>yt-dlp</div><div class='preset-summary-value' style='color:${d.ytdlp?.ok?'#166534':'#b91c1c'}'>${d.ytdlp?.ok?'OK':'Thiếu'}</div></div>
          </div>
          <div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px'>
            <div class='preset-summary-item' style='padding:11px 13px;background:rgba(255,255,255,.78);box-shadow:0 6px 18px rgba(15,23,42,.04)'><div class='preset-summary-label'>FFmpeg version</div><div class='preset-summary-value'>${esc(d.ffmpeg?.version||'-')}</div></div>
            <div class='preset-summary-item' style='padding:11px 13px;background:rgba(255,255,255,.78);box-shadow:0 6px 18px rgba(15,23,42,.04)'><div class='preset-summary-label'>FFprobe version</div><div class='preset-summary-value'>${esc(d.ffprobe?.version||'-')}</div></div>
            <div class='preset-summary-item' style='padding:11px 13px;background:rgba(255,255,255,.78);box-shadow:0 6px 18px rgba(15,23,42,.04)'><div class='preset-summary-label'>yt-dlp version</div><div class='preset-summary-value'>${esc(d.ytdlp?.version||'-')}</div></div>
          </div>`;
      }catch(e){log('Status lỗi: '+e.message)}
    }

    function val(id){return ($(id)?.value||'').trim()}
    function refreshSelectedUploadFiles(){
      const el=$('upload_file'); const box=$('upload_file_selected');
      if(!box) return;
      const files=[...(el?.files||[])];
      if(!files.length){box.textContent=currentLang==='en'?'No files selected.':'Chưa chọn file nào.';}
      else box.innerHTML=files.map((f,i)=>`<div>${i+1}. ${esc(f.name)} <span class=\"muted\">(${formatBytes(f.size||0)})</span></div>`).join('');
      const sub=$('subtitle_file')?.files?.[0];
      const subBox=$('subtitle_file_selected');
      if(subBox){ subBox.innerHTML=sub?`<div>${esc(sub.name)} <span class=\"muted\">(${formatBytes(sub.size||0)})</span></div>`:(currentLang==='en'?'No subtitle selected.':'Chưa chọn subtitle.'); }
    }
    function toggleConfigSection(id,head){
      const body=$(id); if(!body) return;
      const isHidden=body.style.display==='none';
      body.style.display=isHidden?'block':'none';
      const icon=head?.querySelector('.muted');
      if(icon) icon.textContent=isHidden?'▾':'▸';
    }
    function applyDarkMode(on){
      document.body.classList.toggle('dark-mode', !!on);
      const btn=$('dark_mode_toggle');
      if(btn) btn.textContent=on?'☀️':'🌙';
      localStorage.setItem('hls_dark_mode', on?'1':'0');
    }
    function toggleDarkMode(){applyDarkMode(!(document.body.classList.contains('dark-mode')))}
    function updateWelcomeTime(){
      const el=$('welcome_time_text');
      if(!el) return;
      const now=new Date();
      const timeFmt=new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
      const dateFmt=new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'});
      el.textContent=timeFmt.format(now)+' - '+dateFmt.format(now);
    }
