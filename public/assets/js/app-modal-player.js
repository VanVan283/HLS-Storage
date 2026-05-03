async function showEmbed(id, playFromRow=''){
      try{
        const ers=await apiJson(`${api}/videos/${id}/embed`);
        const d=ers?.data||{};
        const embedUrl=String(d.embed_url||'').trim();
        let play=String(playFromRow||'').trim();
        if(!play){
          const vrs=await apiJson(`${api}/videos/${id}`);
          const v=vrs?.data||{};
          play=(v.hls_enabled&&v.hls_playlist)?(String(v.hls_playlist).startsWith('http')?String(v.hls_playlist):`${location.origin}/${String(v.hls_playlist).replace(/^\/+/, '')}`):(v.webViewLink||'');
        }
        const videoEl=$('videoPlayerModal');

        openPlayerModal();
        currentEmbedVideoId=Number(id||0);
        currentEmbedPlayUrl=play||'';
        fillEmbedHostOptions('');
        if($('playerWrap')) $('playerWrap').style.display='none';
        if(hlsInstance){try{hlsInstance.destroy()}catch(e){} hlsInstance=null;}
        if(videoEl){
          try{videoEl.pause()}catch(e){}
          videoEl.removeAttribute('src');
          try{videoEl.load()}catch(e){}
        }
        if($('embedLink')) $('embedLink').value=play||'';
        await refreshEmbedOutputs(id, '');
      }catch(e){
        alert('Lỗi lấy embed: '+e.message)
      }
    }
    let pendingDeleteId=null;
    let pendingDeleteTitle='';
    let pendingCategoryVideoId=null;
    let pendingCategoryCurrent='';
    let deleteQueue=[];
    let deleteRunning=false;
    let deleteStats={total:0,done:0,fail:0};

    function openDeleteModal(id,title=''){pendingDeleteId=id; pendingDeleteTitle=title||''; const t=$('deleteModalText'); if(t) t.textContent=(currentLang==='en'?`Confirm delete video #${id}${title?` - ${title}`:''}?`:`Xác nhận xoá video #${id}${title?` - ${title}`:''}?`); $('deleteModal')?.classList.add('show')}
    function closeDeleteModal(){pendingDeleteId=null; pendingDeleteTitle=''; $('deleteModal')?.classList.remove('show')}

    function deleteQueueMeta(currentId=''){const waiting=deleteQueue.length; const lines=[`Đã xong ${deleteStats.done}/${deleteStats.total} • Lỗi ${deleteStats.fail}`]; if(currentId) lines.push(`Đang xoá: #${currentId}`); if(waiting>0) lines.push(`Đang chờ: ${waiting} video`); return lines.join('\n')}

    function enqueueDeleteTask(id,title=''){
      deleteQueue.push({id,title,status:'chờ'});
      deleteStats.total+=1;
      if(deleteRunning){
        showBgBadge('Đã thêm vào hàng chờ xoá',deleteQueueMeta(),Math.max(5,Math.min(95,Math.round((deleteStats.done/Math.max(1,deleteStats.total))*100))));
      }
      processDeleteQueue();
    }

    async function processDeleteQueue(){
      if(deleteRunning) return;
      if(!deleteQueue.length) return;
      deleteRunning=true;
      while(deleteQueue.length){
        const item=deleteQueue.shift();
        const pct=Math.max(5,Math.min(95,Math.round((deleteStats.done/Math.max(1,deleteStats.total))*100)));
        showBgBadge(`Đang xoá video #${item.id}...`,deleteQueueMeta(item.id),pct);
        setUploadProgress(pct,'Đang xoá video',`Video ID: ${item.id} • ${deleteStats.done}/${deleteStats.total}`);
        try{
          await apiJson(`${api}/videos/${item.id}`,{method:'DELETE'});
          deleteStats.done+=1;
          log('Đã xóa #'+item.id);
        }catch(e){
          deleteStats.done+=1;
          deleteStats.fail+=1;
          log('Xóa lỗi #'+item.id+': '+e.message);
        }
      }
      await loadVideos();
      showBgBadge(deleteStats.fail?`⚠️ Hoàn tất xoá (có lỗi)`:'✅ Hoàn tất xoá video',`Đã xong ${deleteStats.done}/${deleteStats.total} • Lỗi ${deleteStats.fail}`,100);
      setUploadProgress(100,'Đã xoá video',`Đã xong ${deleteStats.done}/${deleteStats.total} • Lỗi ${deleteStats.fail}`);
      hideBgBadge(3500);
      deleteRunning=false;
      deleteStats={total:0,done:0,fail:0};
    }

    async function confirmDeleteVideo(){
      const id=pendingDeleteId; if(!id) return;
      const title=pendingDeleteTitle;
      closeDeleteModal();
      enqueueDeleteTask(id,title);
    }
    function deleteVideo(id,title=''){openDeleteModal(id,title)}

    function openCategoryModal(id,current=''){
      pendingCategoryVideoId=id;
      pendingCategoryCurrent=current||'';
      if($('change_video_category')) $('change_video_category').value=pendingCategoryCurrent;
      $('categoryModal')?.classList.add('show');
    }
    function closeCategoryModal(){
      pendingCategoryVideoId=null;
      pendingCategoryCurrent='';
      $('categoryModal')?.classList.remove('show');
    }
    async function saveVideoCategoryChange(){
      const id=pendingCategoryVideoId;
      if(!id) return;
      const category=val('change_video_category')||'';
      try{
        await apiJson(`${api}/videos/${id}/category`,{method:'PUT',body:JSON.stringify({category})});
        closeCategoryModal();
        await loadVideos();
        log('Đã cập nhật category cho video #'+id);
      }catch(e){
        alert('Đổi category lỗi: '+e.message);
      }
    }

    let currentEmbedVideoId=0;
    let currentEmbedPlayUrl='';
    let currentEmbedUrl='';
    let currentEmbedAllowedHosts=[];
    let currentMultiEmbedSources=[];
    function getEmbedHostOptions(){
      const parseHosts=(text)=>String(text||'').split(/\r?\n|,/).map(x=>x.trim()).filter(Boolean).map(x=>x.replace(/^https?:\/\//i,'').replace(/\/.*$/,'').trim().toLowerCase()).filter(Boolean);
      const aliasHosts=parseHosts(val('embed_host_aliases')||'');
      const merged=[...new Set(aliasHosts)];
      return [''].concat(merged);
    }
    function fillEmbedHostOptions(selected='', selectId='embedHostSelect'){
      const el=$(selectId); if(!el) return;
      const opts=getEmbedHostOptions();
      el.innerHTML=opts.map(v=>`<option value="${esc(v)}">${v?esc(v):(currentLang==='en'?'Current domain':'Domain hiện tại')}</option>`).join('');
      el.value=opts.includes(selected)?selected:'';
    }
    function applyHostToPlayUrl(rawUrl, host=''){
      const u=String(rawUrl||'').trim();
      if(!u) return '';
      const h=String(host||'').trim();
      if(!h) return u;
      try{
        if(u.startsWith('http://')||u.startsWith('https://')){
          const x=new URL(u);
          x.host=h;
          return x.toString();
        }
      }catch(e){}
      if(u.startsWith('/')) return `${location.protocol}//${h}${u}`;
      return u;
    }
    async function refreshEmbedOutputs(videoId, selectedHost=''){
      if(!videoId) return;
      const url=selectedHost?`${api}/videos/${videoId}/embed?host=${encodeURIComponent(selectedHost)}`:`${api}/videos/${videoId}/embed`;
      const rs=await apiJson(url);
      const d=rs?.data||{};
      currentEmbedAllowedHosts=Array.isArray(d.allowed_hosts)?d.allowed_hosts:[];
      fillEmbedHostOptions(selectedHost||'');
      const embedUrl=String(d.embed_url||'').trim();
      currentEmbedUrl=embedUrl;
      const playByHost=applyHostToPlayUrl(currentEmbedPlayUrl||'', selectedHost||'');
      if($('embedLink')) $('embedLink').value=playByHost;
      if($('embedPageLink')) $('embedPageLink').value=embedUrl;
      if($('iframeCode')) $('iframeCode').value=buildIframeCode(embedUrl || playByHost || '', false);
      if($('iframeCodeFull')) $('iframeCodeFull').value=buildIframeCode(embedUrl || playByHost || '', true);
    }
    async function refreshEmbedHostSelection(){
      const host=($('embedHostSelect')?.value||'').trim();
      await refreshEmbedOutputs(currentEmbedVideoId, host);
    }
    function buildIframeCode(url, full=false){
      const src=String(url||'').trim();
      if(!src) return '';
      let finalUrl=src;
      const withParam=(url,k,v)=>{
        const hasQ=url.includes('?');
        const re=new RegExp('([?&])'+k+'=[^&]*');
        if(re.test(url)) return url.replace(re, '$1'+k+'='+v);
        return url + (hasQ?'&':'?') + k + '=' + v;
      };
      const dropParam=(url,k)=>url.replace(new RegExp('([?&])'+k+'=[^&]*','g'),'$1').replace(/[?&]$/,'').replace('?&','?');
      if($('iframeMuteToggle')?.checked) finalUrl=withParam(finalUrl,'mute','1');
      else finalUrl=dropParam(finalUrl,'mute');
      if($('iframeAutoplayToggle')?.checked) finalUrl=withParam(finalUrl,'autoplay','1');
      else finalUrl=dropParam(finalUrl,'autoplay');
      const safe=finalUrl.replace(/"/g,'&quot;');
      if(full){
        return `<iframe src="${safe}" width="100%" style="aspect-ratio:16/9;min-height:360px;border:0" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" allowfullscreen></iframe>`;
      }
      return `<iframe src="${safe}" width="100%" height="500" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
    function refreshCurrentIframeCode(){
      const src=(currentEmbedUrl||$('embedLink')?.value||'').trim();
      if($('iframeCode')) $('iframeCode').value=buildIframeCode(src, false);
      if($('iframeCodeFull')) $('iframeCodeFull').value=buildIframeCode(src, true);
    }
    window.refreshCurrentIframeCode = refreshCurrentIframeCode;
    function openPlayerModal(){ $('multiEmbedModal')?.classList.remove('show'); $('playerModal')?.classList.add('show') }
    function closePlayerModal(){ const v=$('videoPlayerModal'); if(v){try{v.pause()}catch(e){}} const f=$('playerEmbedFrame'); if(f){ try{ f.srcdoc=''; }catch(e){} try{ f.removeAttribute('src'); }catch(e){} f.src='about:blank'; } if(hlsInstance){try{hlsInstance.destroy()}catch(e){} hlsInstance=null;} $('playerModal')?.classList.remove('show') }
    async function playVideo(id,url){
      openPlayerModal();
      currentEmbedVideoId=Number(id||0);
      currentEmbedPlayUrl=url||'';
      fillEmbedHostOptions('');
      if($('playerWrap')) $('playerWrap').style.display='block';
      currentEmbedUrl='';
      if($('embedLink')) $('embedLink').value=url||'';
      if($('embedPageLink')) $('embedPageLink').value='';
      if($('iframeCode')) $('iframeCode').value='';
      if($('iframeCodeFull')) $('iframeCodeFull').value='';
      let f=$('playerEmbedFrame');
      if(f && f.parentNode){
        const fresh=document.createElement('iframe');
        fresh.id='playerEmbedFrame';
        fresh.style.cssText=f.style.cssText;
        fresh.setAttribute('allow','autoplay; fullscreen; picture-in-picture');
        fresh.setAttribute('allowfullscreen','');
        fresh.src='about:blank';
        f.parentNode.replaceChild(fresh, f);
        f=fresh;
      } else if(f){
        f.src='about:blank';
      }
      if(hlsInstance){try{hlsInstance.destroy()}catch(e){} hlsInstance=null}
      try{
        await refreshEmbedOutputs(id, '');
        const embedUrl=(currentEmbedUrl||'').trim();
        if(f && embedUrl) f.src=embedUrl;
      }catch(e){
        if($('iframeCode')) $('iframeCode').value=buildIframeCode(url, false);
        if($('iframeCodeFull')) $('iframeCodeFull').value=buildIframeCode(url, true);
      }
    }
    function playUrl(url){ return playVideo(0,url); }
    function copyText(t){navigator.clipboard.writeText(t||''); log('Đã copy')}
    function copyEmbedLink(){copyText($('embedLink')?.value||'')}
    function copyEmbedPageLink(){copyText($('embedPageLink')?.value||currentEmbedUrl||'')}
    function copyIframeCode(){copyText($('iframeCode')?.value||'')}
    function copyFullEmbedCode(){copyText($('iframeCodeFull')?.value||$('iframeCode')?.value||'')}
    function openEmbedLink(){const v=$('embedPageLink')?.value||$('embedLink')?.value||(currentEmbedUrl||''); if(v) window.open(v,'_blank')}
    
    
    
    
    
    
    
    function openCustomVarHelp(){ $('customVarHelpModal')?.classList.add('show') }
    function openCustomJwVarHelp(){ $('customJwVarHelpModal')?.classList.add('show') }
    function closeCustomJwVarHelp(){ $('customJwVarHelpModal')?.classList.remove('show') }
    window.openCustomJwVarHelp = openCustomJwVarHelp;
    window.closeCustomJwVarHelp = closeCustomJwVarHelp;

    function applyJwCustomTemplate(){
      const html=$('embed_custom_html'), css=$('embed_custom_css'), js=$('embed_custom_js');
      if(!html||!css||!js) return;
      html.value = '<div id="jw-wrap" style="width:100%;height:100%;background:#000"><div id="jw-player" style="width:100%;height:100%"></div></div>';
      css.value = '#jw-wrap{position:relative;width:100%;height:100%;background:#000}';
      js.value = "(function(){\n  var lib='https://content.jwplatform.com/libraries/Fy91HICy.js';\n  function boot(){\n    if(!window.jwplayer) return;\n    var cfg={file:'{{SRC}}',width:'100%',height:'100%',autostart:false,controls:true,stretching:'uniform'};\n    if('{{SUB_URL}}'){ cfg.tracks=[{file:'{{SUB_URL}}',kind:'captions',label:'Subtitle',default:true}]; cfg.captions={default:true}; }\n    jwplayer('jw-player').setup(cfg);\n  }\n  if(!window.jwplayer){\n    var s=document.createElement('script'); s.src=lib; s.onload=boot; document.head.appendChild(s);\n  }else{ boot(); }\n})();";
      try{ window.queueAutoSave && window.queueAutoSave(); }catch(e){}
      try{ alert('Đã điền mẫu JW Custom. Nhớ bấm Lưu cài đặt Player.'); }catch(e){}
    }
    function applyCustomerJwConfig(){
      const lib=$('jw_custom_library_url')?.value?.trim()||'';
      const pluginsRaw=$('jw_custom_plugin_urls')?.value||'';
      const setupRaw=$('jw_custom_setup_json')?.value?.trim()||'';
      const html=$('embed_custom_html'), css=$('embed_custom_css'), js=$('embed_custom_js');
      if(!html||!css||!js){ alert('Thiếu ô Custom Player'); return; }
      if(!lib){ alert('Vui lòng nhập JW Library URL'); return; }
      let setupObj={stretching:'uniform',autostart:false,controls:true};
      if(setupRaw){
        try{ setupObj=JSON.parse(setupRaw); }catch(e){ alert('JW Setup JSON không hợp lệ'); return; }
      }
      html.value='<div id="jw-wrap" style="width:100%;height:100%;background:#000"><div id="jw-player" style="width:100%;height:100%"></div></div>';
      css.value='#jw-wrap{position:relative;width:100%;height:100%;background:#000}';
      const plugins=pluginsRaw.split(/\r?\n/).map(s=>String(s||'').trim()).filter(Boolean);
      const setupJson=JSON.stringify(setupObj||{});
      js.value = `(function(){\n  var lib=${JSON.stringify(lib)};\n  var plugins=${JSON.stringify(plugins)};\n  var baseCfg=${setupJson};\n  function loadScript(src, cb){ var s=document.createElement('script'); s.src=src; s.onload=cb; s.onerror=cb; document.head.appendChild(s); }\n  function loadPlugins(i, done){ if(i>=plugins.length) return done(); loadScript(plugins[i], function(){ loadPlugins(i+1, done); }); }\n  function boot(){\n    if(!window.jwplayer) return;\n    var cfg=Object.assign({}, baseCfg||{});\n    cfg.file='{{SRC}}';\n    cfg.width='100%'; cfg.height='100%';\n    if('{{SUB_URL}}'){ cfg.tracks=[{file:'{{SUB_URL}}',kind:'captions',label:'Subtitle',default:true}]; cfg.captions=Object.assign({}, cfg.captions||{}, {default:true}); }\n    jwplayer('jw-player').setup(cfg);\n  }\n  if(!window.jwplayer){ loadScript(lib, function(){ loadPlugins(0, boot); }); }\n  else { loadPlugins(0, boot); }\n})();`;
      try{ window.queueAutoSave && window.queueAutoSave(); }catch(e){}
      alert('Đã áp dụng cấu hình JW của khách vào Custom Player. Bấm Lưu cài đặt Player để dùng.');
    }
    window.applyJwCustomTemplate = applyJwCustomTemplate;
    window.applyCustomerJwConfig = applyCustomerJwConfig;
    function closeCustomVarHelp(){ $('customVarHelpModal')?.classList.remove('show') }
    function closeOriginalFileModal(){ $('originalFileModal')?.classList.remove('show') }
    function openOriginalFileUrl(){const u=$('original_file_url')?.value||''; if(u && /^https?:\/\//i.test(u)) window.open(u,'_blank');}
    function showOriginalFileInfo(raw){
      let meta=null;
      try{meta=JSON.parse(raw)}catch(e){meta=null}
      if(!meta){alert('Không đọc được dữ liệu file gốc'); return;}
      $('original_file_mode').textContent=meta.mode||'-';
      $('original_file_account').textContent=meta.account||'-';
      $('original_file_key').textContent=meta.key||meta.path||'-';
      $('original_file_error').textContent=meta.error||'-';
      const url=meta.url||'';
      $('original_file_url').value=url||'';
      const btn=$('btn_open_original_url'); if(btn) btn.style.display=(url && /^https?:\/\//i.test(url))?'inline-flex':'none';
      $('originalFileModal')?.classList.add('show');
    }
