
    function collectSettingsPayload(){const ftpCount=normalizePool('ftp').length, r2Count=normalizePool('r2').length, b2Count=normalizePool('b2').length, gdCount=normalizePool('gdrive').length, ttbCount=normalizePool('ttb').length; const scaleMode=((val('ffmpeg_scale_mode')||'').toLowerCase()||'pad'); return {storage_mode:val('storage_mode'),upload_api_base:val('upload_api_base'),upload_chunk_mb:Number(val('upload_chunk_mb')||20),local_path:val('local_path'),local_mode_enabled:val('local_mode_enabled')==='1',ftp_hostname:val('ftp_hostname'),ftp_port:Number(val('ftp_port')||21),ftp_user:val('ftp_user'),ftp_pass:val('ftp_pass'),ftp_path:val('ftp_path'),ftp_accounts_json:val('ftp_accounts_json'),ftp_multi_enabled:ftpCount>1,ftp_round_robin_enabled:val('ftp_round_robin_enabled')==='1',ftp_fallback_enabled:val('ftp_fallback_enabled')==='1',ftp_default_account_index:Number(val('ftp_default_account_index')||0),ftp_mode_enabled:val('ftp_mode_enabled')==='1',r2_bucket:val('r2_bucket'),r2_key:val('r2_key'),r2_secret:val('r2_secret'),r2_endpoint:val('r2_endpoint'),r2_accounts_json:val('r2_accounts_json'),r2_multi_enabled:r2Count>1,r2_round_robin_enabled:val('r2_round_robin_enabled')==='1',r2_fallback_enabled:val('r2_fallback_enabled')==='1',r2_default_account_index:Number(val('r2_default_account_index')||0),r2_mode_enabled:val('r2_mode_enabled')==='1',b2_bucket:val('b2_bucket'),b2_key:val('b2_key'),b2_secret:val('b2_secret'),b2_endpoint:val('b2_endpoint'),b2_accounts_json:val('b2_accounts_json'),b2_multi_enabled:b2Count>1,b2_round_robin_enabled:val('b2_round_robin_enabled')==='1',b2_fallback_enabled:val('b2_fallback_enabled')==='1',b2_default_account_index:Number(val('b2_default_account_index')||0),b2_mode_enabled:val('b2_mode_enabled')==='1',gdrive_client_id:val('gdrive_client_id'),gdrive_client_secret:val('gdrive_client_secret'),gdrive_redirect_uri:val('gdrive_redirect_uri'),gdrive_shared_drive_id:val('gdrive_shared_drive_id'),gdrive_mode:val('gdrive_mode'),gdrive_accounts_json:val('gdrive_accounts_json'),gdrive_multi_enabled:gdCount>1,gdrive_round_robin_enabled:val('gdrive_round_robin_enabled')==='1',gdrive_fallback_enabled:val('gdrive_fallback_enabled')==='1',gdrive_default_account_index:Number(val('gdrive_default_account_index')||0),gdrive_mode_enabled:val('gdrive_mode_enabled')==='1',ttb_accounts_json:val('ttb_accounts_json'),ttb_multi_enabled:ttbCount>1,ttb_round_robin_enabled:val('ttb_round_robin_enabled')==='1',ttb_fallback_enabled:val('ttb_fallback_enabled')==='1',ttb_default_account_index:Number(val('ttb_default_account_index')||0),ttb_mode_enabled:val('ttb_mode_enabled')==='1',delete_sync_storage:val('delete_sync_storage')==='1',categories_json:val('categories_json'),embed_domain_whitelist:val('embed_domain_whitelist'),embed_host_aliases:val('embed_host_aliases'),embed_strict_mode:val('embed_strict_mode')==='1',embed_player_type:((val('license_plan')||'trial').toLowerCase()==='premium'?(val('embed_player_type')||'native'):'native'),embed_vast_url:((val('license_plan')||'trial').toLowerCase()==='premium'?(val('embed_vast_url')||''):''),embed_vmap_url:((val('license_plan')||'trial').toLowerCase()==='premium'?(val('embed_vmap_url')||''):''),embed_custom_html:((val('license_plan')||'trial').toLowerCase()==='premium'?(val('embed_custom_html')||''):''),embed_custom_css:((val('license_plan')||'trial').toLowerCase()==='premium'?(val('embed_custom_css')||''):''),embed_custom_js:((val('license_plan')||'trial').toLowerCase()==='premium'?(val('embed_custom_js')||''):''),embed_jw_library_url:((val('license_plan')||'trial').toLowerCase()==='premium'?(val('jw_custom_library_url')||''):''),embed_jw_plugin_urls:((val('license_plan')||'trial').toLowerCase()==='premium'?(val('jw_custom_plugin_urls')||''):''),embed_jw_setup_json:((val('license_plan')||'trial').toLowerCase()==='premium'?(val('jw_custom_setup_json')||''):''),embed_hlsjs_config_json:JSON.stringify({maxBufferLength:Number(val('hlsjs_max_buffer_length')||30),maxMaxBufferLength:Number(val('hlsjs_max_max_buffer_length')||600),backBufferLength:Number(val('hlsjs_back_buffer_length')||30),maxBufferHole:Number(val('hlsjs_max_buffer_hole')||0.5),startFragPrefetch:val('hlsjs_start_prefetch')==='1',multiServerListPosition:val('multi_server_list_position')||'outside-bottom',multiServerListCss:val('multi_server_list_css')||'',multiServerListJs:val('multi_server_list_js')||'',thumbnailMaxWidth:Number(val('thumbnail_max_width')||720),ffmpegScaleMode:scaleMode}),embed_watermark_rules_json:val('embed_watermark_rules_json'),ffmpeg_preset:val('ffmpeg_preset')||'fast',ffmpeg_fps:Number(val('ffmpeg_fps')||24),ffmpeg_threads:Number(val('ffmpeg_threads')||2),hls_segment_duration:Number(val('hls_segment_duration')||10),ffmpeg_scale_pad_enabled:scaleMode==='pad',ffmpeg_scale_mode:scaleMode}}
    let __systemStatusCache=null;
    function renderFfmpegThreadsHint(){
      const el=$('ffmpeg_threads_hint');
      if(!el) return;
      const cores=Number(__systemStatusCache?.cpu?.cores||0);
      if(!Number.isFinite(cores) || cores<=0){el.textContent=tr('Khuyên dùng khoảng 50–70% số core CPU.','Recommended around 50–70% of CPU cores.'); return;}
      const recommend=Math.max(1, Math.min(cores, Math.round(cores*0.6)));
      el.textContent=(currentLang==='en')?`Server has ${cores} cores • recommended ${recommend} threads`:`Server có ${cores} core • khuyên dùng ${recommend} threads`;
    }
    

    function queueAutoSave(){
      if(autoSaveTimer) clearTimeout(autoSaveTimer);
      autoSaveTimer=setTimeout(()=>saveSettings(true),450);
    }
    async function saveSettings(silent=false){
      if(autoSaving) return;
      autoSaving=true;
      try{
        const payload=collectSettingsPayload();
        const mode=String(val('embed_player_type')||'native').toLowerCase();
        if(mode==='custom_jw'){
          const lib=String(val('jw_custom_library_url')||'').trim();
          const plugins=String(val('jw_custom_plugin_urls')||'').split(/\r?\n/).map(s=>String(s||'').trim()).filter(Boolean);
          const rawJs=String(val('jw_custom_setup_json')||'').trim();
          payload.embed_custom_html='<div id="jw-wrap" style="width:100%;height:100%;background:#000"><div id="jw-player" style="width:100%;height:100%"></div></div>';
          payload.embed_custom_css='#jw-wrap{position:relative;width:100%;height:100%;background:#000}';
          payload.embed_custom_js = `(function(){\n  var VV_SRC='{{SRC}}';\n  var VV_SUB_URL='{{SUB_URL}}';\n  var VV_TITLE='{{TITLE}}';\n  var VV_VAST_URL='{{VAST_URL}}';\n  var VV_VMAP_URL='{{VMAP_URL}}';\n  var VV_MULTI_SOURCES={{MULTI_SOURCES_JSON}};\n  var VV_CURRENT_INDEX={{MULTI_CURRENT_INDEX}};\n  var VV_CURRENT_LABEL='{{MULTI_CURRENT_LABEL}}';\n  window.VV_SRC=VV_SRC; window.VV_SUB_URL=VV_SUB_URL; window.VV_TITLE=VV_TITLE; window.VV_VAST_URL=VV_VAST_URL; window.VV_VMAP_URL=VV_VMAP_URL; window.VV_MULTI_SOURCES=VV_MULTI_SOURCES; window.VV_CURRENT_INDEX=VV_CURRENT_INDEX; window.VV_CURRENT_LABEL=VV_CURRENT_LABEL;\n  var __lib=${JSON.stringify(lib)};\n  var __plugins=${JSON.stringify(plugins)};\n  var __raw=${JSON.stringify(rawJs)};\n  function loadScript(src, cb){ if(!src) return cb&&cb(); var s=document.createElement('script'); s.src=src; s.onload=cb; s.onerror=cb; document.head.appendChild(s); }\n  function loadPlugins(i, done){ if(i>=__plugins.length) return done(); loadScript(__plugins[i], function(){ loadPlugins(i+1, done); }); }\n  function boot(){ try{ (new Function(__raw))(); }catch(e){ console.error(e); } }\n  if(!window.jwplayer){ loadScript(__lib, function(){ loadPlugins(0, boot); }); } else { loadPlugins(0, boot); }\n})();`;
        }
        await apiJson(`${api}/settings`,{method:'PUT',body:JSON.stringify(payload)}); log('Đã lưu cấu hình'); if(!silent) alert('Đã lưu cấu hình');
      }
      catch(e){log('Lưu lỗi: '+e.message); if(!silent) alert(e.message)}
      finally{autoSaving=false}
    }
    function accountJsonKey(mode){if(mode==='ftp') return 'ftp_accounts_json'; if(mode==='r2') return 'r2_accounts_json'; if(mode==='b2') return 'b2_accounts_json'; if(mode==='gdrive') return 'gdrive_accounts_json'; if(mode==='ttb') return 'ttb_accounts_json'; return ''}
    function parseAccounts(mode){const key=accountJsonKey(mode); if(!key) return []; const raw=val(key); if(!raw) return []; let arr=[]; try{arr=JSON.parse(raw)}catch(e){throw new Error('JSON không hợp lệ')} if(!Array.isArray(arr)) throw new Error('JSON phải là mảng account'); return arr}
    function setAccounts(mode,arr){const key=accountJsonKey(mode); const el=$(key); if(!el) return; el.value=JSON.stringify(arr,null,2)}
    function legacyAccount(mode){
      if(mode==='local') return {name:'Local #1',path:(val('local_path')||'storage/app/videos-local')};
      if(mode==='ftp') return {name:'FTP #1',hostname:val('ftp_hostname'),port:Number(val('ftp_port')||21),user:val('ftp_user'),pass:val('ftp_pass'),path:val('ftp_path')};
      if(mode==='r2') return {name:'R2 #1',bucket:val('r2_bucket'),key:val('r2_key'),secret:val('r2_secret'),endpoint:val('r2_endpoint')};
      if(mode==='b2') return {name:'B2 #1',bucket:val('b2_bucket'),key:val('b2_key'),secret:val('b2_secret'),endpoint:val('b2_endpoint')};
      if(mode==='ttb') return {name:'TikTok #1',session_profile:'ttb_acc1',raw_base_url:'https://p16-sg.tiktokcdn.com/obj/',cookie_json:'',note:'Dán cookie JSON tại đây'};
      return {name:'GDrive #1',client_id:val('gdrive_client_id'),client_secret:val('gdrive_client_secret'),redirect_uri:val('gdrive_redirect_uri'),token_file:'gdrive_token.json',mode:val('gdrive_mode')||'mydrive',shared_drive_id:val('gdrive_shared_drive_id')};
    }
    function normalizePool(mode){
      let arr=[]; try{arr=parseAccounts(mode)}catch(e){arr=[]}
      if(arr.length===0){
        const acc=legacyAccount(mode);
        const hasData=(mode==='local')?true:(mode==='ftp')?!!(acc.hostname||acc.user||acc.path):(mode==='r2'||mode==='b2')?!!(acc.bucket||acc.key||acc.endpoint):(mode==='ttb')?!!(acc.session_profile||acc.raw_base_url||acc.cookie_json):!!(acc.client_id||acc.client_secret);
        if(hasData){arr=[acc]; setAccounts(mode,arr)}
      }
      arr=arr.map(x=>({...x, enabled:(x&&x.enabled===false)?false:true}));
      return arr;
    }
    function warmUsage(mode,arr,force=false){
      if(mode!=='ftp') return;
      arr.forEach((acc,i)=>{
        if(!force && (acc.__usage || acc.__usage_loading)) return;
        acc.__usage_loading=true;
        setAccounts(mode,arr);
        apiJson(`${api}/storage/account-usage`,{method:'POST',body:JSON.stringify({mode,account:acc})})
          .then(rs=>{const a=normalizePool(mode); if(a[i]){a[i].__usage=rs.data||null; a[i].__usage_loading=false; setAccounts(mode,a); renderStorageAccountPanels();}})
          .catch(()=>{const a=normalizePool(mode); if(a[i]){a[i].__usage_loading=false; setAccounts(mode,a); renderStorageAccountPanels();}});
      });
    }
    function refreshStorageUsageAfterJobDone(){
      try{warmUsage('ftp',normalizePool('ftp'),true)}catch(e){}
    }
    function accountSummary(mode,acc){if(mode==='local') return `${acc.name||'(Local)'} • ${acc.path||'-'}`; if(mode==='ftp') return `${acc.name||'(FTP)'} • ${acc.hostname||'-'}:${acc.port||21}`; if(mode==='r2') return `${acc.name||'(R2)'} • ${acc.bucket||'-'} • ${acc.endpoint||'-'}`; if(mode==='b2') return `${acc.name||'(B2)'} • ${acc.bucket||'-'} • ${acc.endpoint||'-'}`; if(mode==='ttb') return `${acc.name||'(TikTok)'} • ${acc.session_profile||acc.raw_base_url||'-'}`; return `${acc.name||'(GDrive)'} • token: ${acc.token_file||'gdrive_token.json'}`}
    function usageHtml(acc){const u=acc?.__usage; if(acc?.__usage_loading) return '<div class="usage-text">Dung lượng: đang tải...</div>'; if(!u||u.total==null||u.used==null) return '<div class="usage-text">Dung lượng: chưa có dữ liệu</div>'; const total=Number(u.total||0),used=Number(u.used||0); const pct=total>0?Math.max(0,Math.min(100,used*100/total)):0; const freePct=Math.max(0,100-pct); const warn=freePct<=15; return `<div class="usage-wrap"><div class="usage-bar"><div class="usage-used" style="width:${pct}%"></div><div class="usage-free ${warn?'warn':''}" style="width:${freePct}%"></div></div><div class="usage-text">Đã dùng ${formatBytes(used)} / ${formatBytes(total)} (${pct.toFixed(1)}%)</div></div>`}
    function getDefaultIndex(mode){return Number($(mode+'_default_account_index')?.value||0)}
    function setDefaultIndex(mode,idx){const el=$(mode+'_default_account_index'); if(el) el.value=String(Math.max(0,idx||0)); renderStorageAccountPanels(); queueAutoSave()}
