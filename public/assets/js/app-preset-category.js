const PRESET_KEY='hls_upload_preset_single_v1';
    function getPreset(){try{return JSON.parse(localStorage.getItem(PRESET_KEY)||'null')}catch(e){return null}}
    function setPreset(obj){try{localStorage.setItem(PRESET_KEY,JSON.stringify(obj||null))}catch(e){}}
function getCategories(){try{const arr=JSON.parse(val('categories_json')||'[]')||[]; return Array.isArray(arr)?arr.filter(x=>String(x||'').trim()!=='').map(x=>String(x).trim()):[]}catch(e){return []}}
    function setCategories(arr){const uniq=[...new Set((arr||[]).map(x=>String(x||'').trim()).filter(Boolean))]; if($('categories_json')) $('categories_json').value=JSON.stringify(uniq);}
    function renderCategoryOptions(){const arr=getCategories(); const opts=[`<option value="">${tr('-- Chọn category --','-- Select category --')}</option>`,...arr.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`)].join(''); ['video_category','preset_category','filter_category','change_video_category'].forEach(id=>{const el=$(id); if(!el) return; const cur=el.value; el.innerHTML=id==='filter_category'?(`<option value="">${tr('Tất cả','All')}</option>`+arr.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')):opts; if(cur && [...el.options].some(o=>o.value===cur)) el.value=cur;});}
    function renderCategoryManager(){const root=$('category_list'); if(!root) return; const arr=getCategories(); if(!arr.length){root.innerHTML='<div class="muted">Chưa có category.</div>'; return;} root.innerHTML=arr.map((x,i)=>`<div class="category-chip"><div class="category-chip-main"><span class="category-chip-dot"></span><span class="category-chip-name">${esc(x)}</span></div><button class="x" type="button" title="Xoá" onclick="removeCategoryItem(${i})">✕</button></div>`).join('');}
    function addCategoryItem(){const el=$('category_new_name'); const v=(el?.value||'').trim(); if(!v) return; const arr=getCategories(); arr.push(v); setCategories(arr); if(el) el.value=''; renderCategoryManager(); renderCategoryOptions(); queueAutoSave();}
    function removeCategoryItem(i){const arr=getCategories(); arr.splice(i,1); setCategories(arr); renderCategoryManager(); renderCategoryOptions(); queueAutoSave();}
    function getEmbedWatermarkRules(){
      try{
        const raw=val('embed_watermark_rules_json');
        const arr=JSON.parse(raw||'[]');
        if(!Array.isArray(arr)) return [];
        return arr.map(x=>({
          domain:String(x?.domain||'').trim().toLowerCase(),
          logo:String(x?.logo||'').trim(),
          position:['top-left','top-right','center'].includes(String(x?.position||''))?String(x.position):'top-right',
          duration_mode:['first15','always'].includes(String(x?.duration_mode||''))?String(x.duration_mode):'always'
        })).filter(x=>x.domain&&x.logo);
      }catch(e){return []}
    }
    function setEmbedWatermarkRules(arr){
      const clean=(arr||[]).map(x=>({domain:String(x.domain||'').trim().toLowerCase(),logo:String(x.logo||'').trim(),position:['top-left','top-right','center'].includes(String(x.position||''))?x.position:'top-right',duration_mode:['first15','always'].includes(String(x.duration_mode||''))?x.duration_mode:'always'})).filter(x=>x.domain&&x.logo);
      if($('embed_watermark_rules_json')) $('embed_watermark_rules_json').value=JSON.stringify(clean,null,2);
    }
    function renderEmbedWatermarkRules(){
      const root=$('embed_watermark_rules_list'); if(!root) return;
      const arr=getEmbedWatermarkRules();
      if(!arr.length){root.innerHTML=`<div class="muted">${tr('Chưa có rule watermark.','No watermark rules yet.')}</div>`; return;}
      root.innerHTML=arr.map((r,i)=>`<div style="display:grid;grid-template-columns:1fr 1.2fr .8fr .8fr auto;gap:8px;align-items:center;padding:6px 0;border-bottom:1px dashed var(--color-defaultBorder)"><div><b>${esc(r.domain)}</b></div><div class="muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.logo)}</div><div>${r.position==='top-left'?'Góc trái':(r.position==='center'?'Giữa':'Góc phải')}</div><div>${r.duration_mode==='first15'?'15s đầu':'Toàn video'}</div><button class="btn-mini delete" type="button" onclick="removeEmbedWatermarkRule(${i})">Xoá</button></div>`).join('');
    }
    function addEmbedWatermarkRule(){
      const domain=val('wm_rule_domain').toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'').trim();
      const logo=val('wm_rule_logo').trim();
      const position=val('wm_rule_position')||'top-right';
      const duration_mode=val('wm_rule_duration')||'always';
      if(!domain||!logo) return alert('Anh nhập domain và logo URL');
      const arr=getEmbedWatermarkRules();
      const idx=arr.findIndex(x=>x.domain===domain);
      const item={domain,logo,position,duration_mode};
      if(idx>=0) arr[idx]=item; else arr.push(item);
      setEmbedWatermarkRules(arr); renderEmbedWatermarkRules(); queueAutoSave();
      if($('wm_rule_domain')) $('wm_rule_domain').value='';
      if($('wm_rule_logo')) $('wm_rule_logo').value='';
    }
    function removeEmbedWatermarkRule(i){const arr=getEmbedWatermarkRules(); arr.splice(i,1); setEmbedWatermarkRules(arr); renderEmbedWatermarkRules(); queueAutoSave();}
    function captureCurrentUploadConfig(){return sanitizeConfigByPlan({enable_hls:$('enable_hls')?.value==='1',hls_quality:getSelectedQuality(),keep_original:isKeepOriginal(),original_storage_mode:val('original_storage_mode')||'',create_thumbnail:isCreateThumbnail(),rename_segment:isRenameSegment(),encrypt_hls:isEncryptHls(),category:val('video_category')||'',storage_mode_overrides:getSelectedStorageModes()})}
    function capturePresetEditorConfig(){return sanitizeConfigByPlan({enable_hls:$('preset_enable_hls')?.value==='1',hls_quality:[$('preset_hls_quality')?.value||'720'],keep_original:$('preset_keep_original')?.value==='1',original_storage_mode:val('preset_original_storage_mode')||'',create_thumbnail:$('preset_create_thumbnail')?.value==='1',rename_segment:$('preset_rename_segment')?.value==='1',encrypt_hls:$('preset_encrypt_hls')?.value==='1',category:val('preset_category')||'',storage_mode_overrides:[...document.querySelectorAll('.preset-storage-chip:checked')].map(x=>x.value)})}
    function fillPresetEditor(cfg){cfg=sanitizeConfigByPlan(cfg); if(!cfg) return; [['preset_enable_hls',cfg.enable_hls],['preset_keep_original',cfg.keep_original],['preset_create_thumbnail',cfg.create_thumbnail],['preset_rename_segment',cfg.rename_segment],['preset_encrypt_hls',cfg.encrypt_hls]].forEach(([id,val])=>{const el=$(id); if(el) el.value=val?'1':'0'; const b=$(id+'_toggle'),t=$(id+'_text'); b?.classList.toggle('on',el?.value==='1'); if(t) t.textContent=el?.value==='1'?tr('Đang bật','Enabled'):tr('Đang tắt','Disabled');}); updatePresetOriginalStorageField(); if($('preset_original_storage_mode')) $('preset_original_storage_mode').value=(cfg.original_storage_mode||''); if($('preset_hls_quality')) $('preset_hls_quality').value=(cfg.hls_quality?.[0]||'720'); if($('preset_category')) $('preset_category').value=(cfg.category||''); document.querySelectorAll('.preset-storage-chip').forEach(c=>c.checked=(cfg.storage_mode_overrides||[]).includes(c.value));}
    function applyPresetConfig(cfg){if(!cfg) return; if($('enable_hls')) {$('enable_hls').value=cfg.enable_hls?'1':'0'; toggleHlsSwitch(); if($('enable_hls').value!==(cfg.enable_hls?'1':'0')) toggleHlsSwitch();}
      if($('hls_quality')&&cfg.hls_quality?.[0]) $('hls_quality').value=cfg.hls_quality[0];
      [['keep_original',cfg.keep_original],['create_thumbnail',cfg.create_thumbnail],['rename_segment',cfg.rename_segment],['encrypt_hls',cfg.encrypt_hls]].forEach(([id,val])=>{const el=$(id); if(el){el.value=val?'1':'0'; const b=$(id+'_toggle'),t=$(id+'_text'); b?.classList.toggle('on',el.value==='1'); if(t) t.textContent=el.value==='1'?'Đang bật':'Đang tắt';}});
      updateOriginalStorageField(); if($('original_storage_mode')) $('original_storage_mode').value=(cfg.original_storage_mode||'');
      updatePresetOriginalStorageField(); if($('preset_original_storage_mode')) $('preset_original_storage_mode').value=(cfg.original_storage_mode||'');
      if($('video_category')) $('video_category').value=(cfg.category||'');
      document.querySelectorAll('.storage-chip').forEach(c=>{c.checked=(cfg.storage_mode_overrides||[]).includes(c.value)});
    }
    function savePresetFromConfig(){const payload={name:'Mặc định',config:capturePresetEditorConfig()}; setPreset(payload); renderPresetManager(); applyPresetConfig(payload.config||{}); alert(tr('Đã lưu preset mặc định','Default preset saved'))}
    function loadCurrentUploadToPresetEditor(){fillPresetEditor(captureCurrentUploadConfig())}
    function presetSummary(cfg){
      const safe=sanitizeConfigByPlan(cfg);
      if(!safe) return 'Chưa có preset. Upload sẽ dùng cấu hình hiện tại.';
      const storage=(safe.storage_mode_overrides||[]).length?(safe.storage_mode_overrides||[]).join(', '):tr('Chưa chọn storage','No storage selected');
      const quality=(safe.hls_quality?.[0]||'720')+'p';
      return `Storage: ${storage} • HLS: ${safe.enable_hls?tr('Bật','Enabled'):tr('Tắt','Disabled')} • Quality: ${quality} • AES: ${safe.encrypt_hls?tr('Bật','Enabled'):tr('Tắt','Disabled')}${safe.category?(' • Category: '+safe.category):''}`;
    }
    function renderPresetSummaryHtml(cfg){
      const safe=sanitizeConfigByPlan(cfg);
      if(!safe) return '<div class="preset-summary-empty">Chưa có preset. Upload sẽ dùng cấu hình hiện tại.</div>';
      const items=[
        ['Storage', (safe.storage_mode_overrides||[]).length?(safe.storage_mode_overrides||[]).join(', '):tr('Chưa chọn','Not selected')],
        ['HLS', safe.enable_hls?tr('Bật','Enabled'):tr('Tắt','Disabled')],
        ['Quality', (safe.hls_quality?.[0]||'720')+'p'],
        ['AES', safe.encrypt_hls?tr('Bật','Enabled'):tr('Tắt','Disabled')],
        ['Rename', safe.rename_segment?tr('Bật','Enabled'):tr('Tắt','Disabled')],
        ['Thumbnail', safe.create_thumbnail?tr('Bật','Enabled'):tr('Tắt','Disabled')],
        [tr('Giữ file gốc','Keep original file'), safe.keep_original?tr('Bật','Enabled'):tr('Tắt','Disabled')],
        [tr('Storage file gốc','Original file storage'), safe.original_storage_mode||tr('Chưa chọn','Not selected')],
        ['Category', safe.category||tr('Chưa chọn','Not selected')]
      ];
      return items.map(([label,value])=>`<div class="preset-summary-item"><div class="preset-summary-label">${esc(label)}</div><div class="preset-summary-value">${esc(String(value||''))}</div></div>`).join('');
    }

    function renderOverviewPresetSummaryHtml(cfg){
      const safe=sanitizeConfigByPlan(cfg);
      if(!safe) return '<div class="preset-summary-empty">Chưa có preset. Upload sẽ dùng cấu hình hiện tại.</div>';
      const storage=(safe.storage_mode_overrides||[]).length?(safe.storage_mode_overrides||[]).join(', '):tr('Chưa chọn','Not selected');
      const quality=(safe.hls_quality?.[0]||'720')+'p';
      const topItems=[
        ['Storage', storage],
        ['HLS', safe.enable_hls?tr('Bật','Enabled'):tr('Tắt','Disabled')],
        ['Quality', quality],
        ['AES', safe.encrypt_hls?tr('Bật','Enabled'):tr('Tắt','Disabled')],
        ['Category', safe.category||tr('Chưa chọn','Not selected')]
      ];
      const moreItems=[
        [tr('Đổi tên segment','Rename segment'), safe.rename_segment?tr('Bật','Enabled'):tr('Tắt','Disabled')],
        ['Thumbnail', safe.create_thumbnail?tr('Bật','Enabled'):tr('Tắt','Disabled')],
        [tr('Giữ file gốc','Keep original file'), safe.keep_original?tr('Bật','Enabled'):tr('Tắt','Disabled')],
        [tr('Storage file gốc','Original file storage'), safe.original_storage_mode||tr('Chưa chọn','Not selected')]
      ];
      const top=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:10px">${topItems.map(([label,value])=>`<div class="preset-summary-item" style="background:rgba(255,255,255,.72)"><div class="preset-summary-label">${esc(label)}</div><div class="preset-summary-value">${esc(String(value||''))}</div></div>`).join('')}</div>`;
      const more=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px">${moreItems.map(([label,value])=>`<div class="preset-summary-item"><div class="preset-summary-label">${esc(label)}</div><div class="preset-summary-value">${esc(String(value||''))}</div></div>`).join('')}</div>`;
      return top + more;
    }
    function overviewAccountSummary(){const out=[]; [['local','Local'],['ftp','FTP'],['r2','R2'],['b2','B2'],['gdrive','GDrive'],['ttb','TikTok']].forEach(([mode,label])=>{try{const arr=normalizePool(mode).filter(x=>x&&x.enabled!==false); if(!arr.length) return; const def=getDefaultIndex(mode); const pick=arr[Math.min(def, arr.length-1)]||arr[0]; const name=pick?.name||pick?.session_profile||pick?.hostname||pick?.bucket||pick?.path||label; out.push(`${label}: ${name}`);}catch(e){}}); return out.length?out.join(' • '):'Chưa có account storage.'}
    function renderPresetManager(){const p=getPreset(); if(p) fillPresetEditor(p.config||{}); const summary=presetSummary(p?.config||null); const t=$('preset_summary_text'); if(t) t.innerHTML=renderPresetSummaryHtml(p?.config||null); const o2=$('ov-preset-summary'); if(o2) o2.innerHTML=renderOverviewPresetSummaryHtml(p?.config||null)}
    function autoApplyPresetOnUpload(){const p=getPreset(); if(!p) return; applyPresetConfig(p.config||{})}
    function openPresetModal(){renderPresetManager(); loadCurrentUploadToPresetEditor(); $('presetModal')?.classList.add('show')}
    function closePresetModal(){ $('presetModal')?.classList.remove('show') }
    function getSelectedQuality(){const v=$('hls_quality')?.value; return v?[v]:['720']}
    function getSelectedStorageModes(){return [...document.querySelectorAll('.storage-chip:checked')].map(x=>x.value).filter(m=>(val(m+'_mode_enabled')||'1')==='1')}
    function getLicenseFeatures(){
      try{const raw=String(val('license_features_json')||'{}').trim(); const x=JSON.parse(raw||'{}'); return (x&&typeof x==='object')?x:{};}catch(e){return {}}
    }
    function hasLicenseFeature(key, fallback=false){
      const m=getLicenseFeatures();
      if(Object.prototype.hasOwnProperty.call(m,key)) return !!m[key];
      return !!fallback;
    }
    function sanitizeConfigByPlan(cfg){
      if(!cfg) return cfg;
      const plan=(val('license_plan')||'trial').toLowerCase();
      const premium=(plan==='premium');
      const allowEncrypt=hasLicenseFeature('encrypt_hls', premium);
      const allowMulti=hasLicenseFeature('multi_storage', premium);
      const allowLocal=hasLicenseFeature('storage_local', true);
      const allowFtp=hasLicenseFeature('storage_ftp', true);
      const allowGdrive=hasLicenseFeature('storage_gdrive', true);
      const allowR2=hasLicenseFeature('storage_r2', premium);
      const allowB2=hasLicenseFeature('storage_b2', premium);
      const allowTtb=hasLicenseFeature('storage_ttb', premium);
      const allowed=[...(allowLocal?['local']:[]), ...(allowFtp?['ftp']:[]), ...(allowGdrive?['gdrive']:[]), ...(allowR2?['r2']:[]), ...(allowB2?['b2']:[]), ...(allowTtb?['ttb']:[])];
      let modes=(cfg.storage_mode_overrides||[]).filter(x=>allowed.includes(String(x||'').toLowerCase()));
      if(!allowMulti) modes=modes.slice(0,1);
      const oMode=String(cfg.original_storage_mode||'').toLowerCase();
      return {...cfg, encrypt_hls:allowEncrypt?!!cfg.encrypt_hls:false, subtitle_file:(hasLicenseFeature('softsub', premium)?(cfg.subtitle_file||''):'') , subtitle_name:(hasLicenseFeature('softsub', premium)?(cfg.subtitle_name||''):''), storage_mode_overrides:modes, original_storage_mode:(allowed.includes(oMode)?cfg.original_storage_mode:'')};
    }
    function isKeepOriginal(){return $('keep_original')?.value==='1'}
    function isCreateThumbnail(){return $('create_thumbnail')?.value==='1'}
    function isRenameSegment(){return $('rename_segment')?.value==='1'}
    function isEncryptHls(){return $('encrypt_hls')?.value==='1'}
