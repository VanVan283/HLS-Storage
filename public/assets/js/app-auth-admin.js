async function logoutAdmin(){
      try{await apiJson(`${api}/auth/logout`,{method:'POST'});}catch(e){}
      localStorage.removeItem(AUTH_TOKEN_KEY);
      location.reload();
    }
    async function saveAdminAccount(){
      try{
        const username=val('account_username')||'admin';
        const current=String($('account_current_password')?.value||'');
        const newp=String($('account_new_password')?.value||'');
        const conf=String($('account_new_password_confirm')?.value||'');
        if(newp!==conf) return alert(tr('Mật khẩu mới nhập lại chưa khớp','New password confirmation does not match'));
        const rs=await apiJson(`${api}/auth/update-credentials`,{method:'POST',body:JSON.stringify({username:username,current_password:current,new_password:newp})});
        alert(normalizeUiText(rs.message||tr('Đã lưu','Saved')));
        if($('account_current_password')) $('account_current_password').value='';
        if($('account_new_password')) $('account_new_password').value='';
        if($('account_new_password_confirm')) $('account_new_password_confirm').value='';
      }catch(e){alert(normalizeUiText(e.message||''))}
    }
    function applyHlsBufferPreset(name){
      const presets={
        safe:{maxBufferLength:30,maxMaxBufferLength:600,backBufferLength:30,maxBufferHole:0.5,startFragPrefetch:false},
        balanced:{maxBufferLength:45,maxMaxBufferLength:600,backBufferLength:30,maxBufferHole:0.5,startFragPrefetch:true},
        seek:{maxBufferLength:60,maxMaxBufferLength:600,backBufferLength:45,maxBufferHole:0.8,startFragPrefetch:true}
      };
      const p=presets[name]||presets.balanced;
      if($('hlsjs_max_buffer_length')) $('hlsjs_max_buffer_length').value=String(p.maxBufferLength);
      if($('hlsjs_max_max_buffer_length')) $('hlsjs_max_max_buffer_length').value=String(p.maxMaxBufferLength);
      if($('hlsjs_back_buffer_length')) $('hlsjs_back_buffer_length').value=String(p.backBufferLength);
      if($('hlsjs_max_buffer_hole')) $('hlsjs_max_buffer_hole').value=String(p.maxBufferHole);
      if($('hlsjs_start_prefetch')) $('hlsjs_start_prefetch').value=p.startFragPrefetch?'1':'0';
      syncHiddenSwitch('hlsjs_start_prefetch');
      queueAutoSave();
    }

    function syncCustomPlayerToggleUi(){
      const mode=(val('embed_player_type')||'native');
      const enabled=(mode==='custom' || mode==='custom_jw');
      const btn=$('embed_custom_enabled_toggle');
      const txt=$('embed_custom_enabled_text');
      const jwBtn=$('embed_custom_jw_enabled_toggle');
      const jwTxt=$('embed_custom_jw_enabled_text');
      const box=$('embed_custom_template_box');
      const customBox=$('custom_player_box');
      const jwBox=$('custom_jw_box');
      if(btn) btn.classList.toggle('on', mode==='custom');
      if(txt) txt.textContent=(mode==='custom')?tr('Đang bật','Enabled'):tr('Đang tắt','Disabled');
      if(jwBtn) jwBtn.classList.toggle('on', mode==='custom_jw');
      if(jwTxt) jwTxt.textContent=(mode==='custom_jw')?tr('Đang bật','Enabled'):tr('Đang tắt','Disabled');
      if(box) box.style.display=enabled?'block':'none';
      if(customBox) customBox.style.display=(mode==='custom')?'grid':'none';
      if(jwBox) jwBox.style.display=(mode==='custom_jw')?'grid':'none';
    }
    function toggleCustomPlayerMode(){
      const cur=(val('embed_player_type')||'native');
      const next=(cur==='custom')?'native':'custom';
      if($('embed_player_type')) $('embed_player_type').value=next;
      syncCustomPlayerToggleUi();
      queueAutoSave();
    }
    function toggleCustomJwMode(){
      const cur=(val('embed_player_type')||'native');
      const next=(cur==='custom_jw')?'native':'custom_jw';
      if($('embed_player_type')) $('embed_player_type').value=next;
      const box=$('embed_custom_template_box');
      const customBox=$('custom_player_box');
      const jwBox=$('custom_jw_box');
      if(box) box.style.display=(next==='custom_jw' || next==='custom')?'block':'none';
      if(customBox) customBox.style.display=(next==='custom')?'grid':'none';
      if(jwBox) jwBox.style.display=(next==='custom_jw')?'grid':'none';
      syncCustomPlayerToggleUi();
      queueAutoSave();
    }
    window.syncCustomPlayerToggleUi = syncCustomPlayerToggleUi;
    window.toggleCustomJwMode = toggleCustomJwMode;

    function applyLicensePlanUI(){
      const plan=(val('license_plan')||'trial').toLowerCase();
      const isPremium=plan==='premium';
      const canAdvancedPlayer=hasLicenseFeature('embed_player_advanced', isPremium);
      const canEmbedWhitelist=hasLicenseFeature('embed_whitelist', isPremium);
      const canWatermark=hasLicenseFeature('watermark_rules', isPremium);
      const canDeleteSync=hasLicenseFeature('delete_sync_storage', isPremium);
      const canLocal=hasLicenseFeature('storage_local', true);
      const canFtp=hasLicenseFeature('storage_ftp', true);
      const canGdrive=hasLicenseFeature('storage_gdrive', true);
      const canR2=isPremium || hasLicenseFeature('storage_r2', false);
      const canB2=isPremium || hasLicenseFeature('storage_b2', false);
      const canTtb=isPremium || hasLicenseFeature('storage_ttb', false);
      const canSoftsub=hasLicenseFeature('softsub', isPremium);
      const canEncrypt=hasLicenseFeature('encrypt_hls', isPremium);
      const canHighQuality=hasLicenseFeature('hls_quality_2k4k', isPremium);
      const canMultiStorage=hasLicenseFeature('multi_storage', isPremium);
      const canMultiAccountStorage=hasLicenseFeature('multi_account_storage', isPremium);

      const markPremium=(el,on)=>{
        if(!el) return;
        el.classList.toggle('trial-locked', on);
        const host=el.closest?.('.field') || el.closest?.('.row') || el;
        const chip=el.closest?.('.mode-toggle-chip') || host.closest?.('.mode-toggle-chip');
        const labelTarget=chip
          ? (chip.querySelector('.account-title-wrap > span:last-child') || chip.querySelector('.account-title-wrap') || chip)
          : ((host.querySelector && host.querySelector('label')) ? host.querySelector('label') : host);
        host.querySelectorAll?.('.premium-tag[data-dynamic-premium="1"]').forEach(t=>t.remove());
        if(chip) chip.querySelectorAll?.('.premium-tag[data-dynamic-premium="1"]').forEach(t=>t.remove());
        if(on){
          const tag=document.createElement('span');
          tag.className='premium-tag';
          tag.setAttribute('data-dynamic-premium','1');
          tag.textContent='Premium';
          tag.style.cssText='margin-left:8px;display:inline-flex;vertical-align:middle;font-size:11px;font-weight:800;color:#7c3aed;background:#ede9fe;border:1px solid #ddd6fe;padding:2px 6px;border-radius:999px;';
          if(labelTarget && labelTarget.appendChild) labelTarget.appendChild(tag);
        }
      };

      const player=$('embed_player_type');
      if(player){ player.disabled=!canAdvancedPlayer; if(!canAdvancedPlayer) player.value='native'; player.onchange=()=>{syncCustomPlayerToggleUi(); queueAutoSave();}; }
      if(player && player.value==='custom' && $('embed_custom_js')){
        try{
          const rawJs=String($('embed_custom_js').value||'');
          const mm=rawJs.match(/\/\*__CUSTOM_JW_META__:(.*?)__\*\//);
          if(mm && mm[1]){ player.value='custom_jw'; }
        }catch(_e){}
      }
      const vast=$('embed_vast_url'); const vmap=$('embed_vmap_url');
      const cHtml=$('embed_custom_html'); const cCss=$('embed_custom_css'); const cJs=$('embed_custom_js');
      const jwLib=$('jw_custom_library_url'); const jwPlugins=$('jw_custom_plugin_urls'); const jwSetup=$('jw_custom_setup_json');
      if(vast){ vast.disabled=!canAdvancedPlayer; if(!canAdvancedPlayer) vast.value=''; }
      if(vmap){ vmap.disabled=!canAdvancedPlayer; if(!canAdvancedPlayer) vmap.value=''; }
      if(cHtml){ cHtml.disabled=!canAdvancedPlayer; if(!canAdvancedPlayer) cHtml.value=''; }
      if(cCss){ cCss.disabled=!canAdvancedPlayer; if(!canAdvancedPlayer) cCss.value=''; }
      if(cJs){ cJs.disabled=!canAdvancedPlayer; if(!canAdvancedPlayer) cJs.value=''; }
      if(jwLib){ jwLib.disabled=!canAdvancedPlayer; }
      if(jwPlugins){ jwPlugins.disabled=!canAdvancedPlayer; }
      if(jwSetup){ jwSetup.disabled=!canAdvancedPlayer; }
      $('player_settings_panel')?.classList.toggle('trial-locked', !canAdvancedPlayer);
      const customToggle=$('embed_custom_enabled_toggle');
      if(customToggle){ customToggle.disabled=!canAdvancedPlayer; }
      syncCustomPlayerToggleUi();

      const strictBtn=$('embed_strict_mode_toggle');
      if(strictBtn){ strictBtn.disabled=!canEmbedWhitelist; strictBtn.closest('.switch-row')?.classList.toggle('trial-locked', !canEmbedWhitelist); }
      const delSync=$('delete_sync_storage');
      const delSyncBtn=$('delete_sync_storage_toggle');
      if(delSyncBtn){ delSyncBtn.disabled=!canDeleteSync; delSyncBtn.closest('.switch-row')?.classList.toggle('trial-locked', !canDeleteSync); }
      $('delete_sync_panel')?.classList.toggle('trial-locked', !canDeleteSync);
      if(!canDeleteSync && delSync){ delSync.value='0'; syncHiddenSwitch('delete_sync_storage'); }
      const seg=$('hls_segment_duration');
      if(seg){
        if(!canAdvancedPlayer) seg.value='10';
        seg.disabled=!canAdvancedPlayer;
        markPremium(seg.closest('.field'), !canAdvancedPlayer);
      }
      const wl=$('embed_domain_whitelist');
      if(wl){ wl.disabled=!canEmbedWhitelist; markPremium(wl.closest('.field'), !canEmbedWhitelist); }
      const wm=$('embed_watermark_rules_json');
      if(wm){ wm.disabled=!canWatermark; markPremium(wm.closest('.field'), !canWatermark); }

      [['local_mode_enabled',canLocal],['ftp_mode_enabled',canFtp],['gdrive_mode_enabled',canGdrive],['r2_mode_enabled',canR2],['b2_mode_enabled',canB2],['ttb_mode_enabled',canTtb]].forEach(([id,allow])=>{
        const el=$(id); if(el && !allow) el.value='0'; syncHiddenSwitch(id);
        const btn=$(id+'_toggle'); if(btn) btn.disabled=!allow;
        const chip=btn?.closest('.mode-toggle-chip');
        if(['r2_mode_enabled','b2_mode_enabled','ttb_mode_enabled'].includes(id)){
          chip?.classList.toggle('trial-locked', !allow);
          chip?.querySelectorAll('.premium-tag[data-dynamic-premium="1"]').forEach(t=>t.remove());
        }else{
          markPremium(chip, !allow);
        }
      });
      const modeFeatureMap={r2_mode_enabled:canR2,b2_mode_enabled:canB2,ttb_mode_enabled:canTtb};
      ['r2_mode_enabled','b2_mode_enabled','ttb_mode_enabled'].forEach((id)=>{
        const btn=$(id+'_toggle');
        const chip=btn?.closest('.mode-toggle-chip');
        if(!chip) return;
        chip.querySelectorAll('.premium-tag[data-dynamic-mode="1"]').forEach(t=>t.remove());
        if(modeFeatureMap[id]) return;
        const textNode=chip.querySelector('.account-title-wrap > span:last-child') || chip.querySelector('.account-title-wrap') || chip;
        const t=document.createElement('span');
        t.className='premium-tag';
        t.setAttribute('data-dynamic-mode','1');
        t.textContent='Premium';
        t.style.cssText='margin-left:8px;display:inline-flex;vertical-align:middle;font-size:11px;font-weight:800;color:#7c3aed;background:#ede9fe;border:1px solid #ddd6fe;padding:2px 6px;border-radius:999px;';
        textNode.appendChild(t);
      });

      const subToggle=$('subtitle_toggle');
      const subtitleModeEl=$('subtitle_mode'); if(subToggle){ subToggle.disabled=!canSoftsub; (subToggle.closest('.field')||subToggle.closest('.switch-row')||subToggle).classList.toggle('trial-locked', !canSoftsub); if(!canSoftsub){ subToggle.classList.remove('active'); if(subtitleModeEl) subtitleModeEl.value='0'; refreshSubtitleUi(); } markPremium(subToggle?.closest('.field') || subToggle?.closest('.switch-row') || subToggle, !canSoftsub); }

      const aes=$('encrypt_hls'), aesBtn=$('encrypt_hls_toggle');
      if(aesBtn){ aesBtn.disabled=!canEncrypt; (aesBtn.closest('.field')||aesBtn).classList.toggle('trial-locked', !canEncrypt); markPremium(aesBtn?.closest('.field')||aesBtn, !canEncrypt); }
      if(aes && !canEncrypt){ aes.value='0'; syncHiddenSwitch('encrypt_hls'); }

      const pAes=$('preset_encrypt_hls'), pAesBtn=$('preset_encrypt_hls_toggle');
      if(pAesBtn) pAesBtn.disabled=!canEncrypt;
      if(pAes && !canEncrypt){ pAes.value='0'; syncHiddenSwitch('preset_encrypt_hls'); }
      markPremium(pAesBtn?.closest('.field'), !canEncrypt);

      const lockQuality=(sel)=>{if(!sel) return; [...sel.options].forEach(o=>{const v=Number(o.value||0); const allow=(v<=1080)||canHighQuality; o.disabled=!allow; o.hidden=!allow;}); if(!canHighQuality && Number(sel.value||0)>1080) sel.value='1080';};
      lockQuality($('hls_quality')); lockQuality($('preset_hls_quality'));

      const limitModes=[...(canLocal?['local']:[]), ...(canFtp?['ftp']:[]), ...(canGdrive?['gdrive']:[]), ...(canR2?['r2']:[]), ...(canB2?['b2']:[]), ...(canTtb?['ttb']:[])];
      const lockSelectByPlan=(id)=>{
        const el=$(id); if(!el) return;
        [...el.options].forEach(o=>{const v=String(o.value||'').toLowerCase(); if(v==='') return; const allow=isPremium||limitModes.includes(v); o.disabled=!allow;});
        if(!isPremium){ const v=String(el.value||'').toLowerCase(); if(v && !limitModes.includes(v)) el.value=''; }
      };
      lockSelectByPlan('original_storage_mode');
      lockSelectByPlan('preset_original_storage_mode');
      const enforceSingle = (selector) => {
        const checked=[...document.querySelectorAll(selector+':checked')];
        if(!canMultiStorage && checked.length>1){ checked.slice(1).forEach(ch=>ch.checked=false); }
      };

      const storageFeatureMap={local:canLocal, ftp:canFtp, gdrive:canGdrive, r2:canR2, b2:canB2, ttb:canTtb};
      document.querySelectorAll('.storage-chip').forEach(ch=>{
        const v=(ch.value||'').toLowerCase();
        const allow=isPremium || limitModes.includes(v);
        const featureAllow=!!storageFeatureMap[v];
        ch.disabled=!allow;
        const opt=ch.closest('.storage-option');
        opt?.classList.toggle('trial-locked', !allow);
        opt?.querySelectorAll('.premium-tag[data-storage-premium="1"]').forEach(t=>t.remove());
        if(['r2','b2','ttb'].includes(v) && !featureAllow && opt){
          const t=document.createElement('span');
          t.className='premium-tag';
          t.setAttribute('data-storage-premium','1');
          t.textContent='Premium';
          t.style.cssText='position:absolute;right:8px;bottom:8px;font-size:11px;font-weight:800;color:#7c3aed;background:#ede9fe;border:1px solid #ddd6fe;padding:2px 6px;border-radius:999px;';
          opt.appendChild(t);
        }
        if(!allow) ch.checked=false;
      });
      document.querySelectorAll('.preset-storage-chip').forEach(ch=>{
        const v=(ch.value||'').toLowerCase();
        const allow=isPremium || limitModes.includes(v);
        ch.disabled=!allow;
        ch.closest('.storage-option')?.classList.toggle('trial-locked', !allow);
        if(!allow) ch.checked=false;
      });
      enforceSingle('.storage-chip'); enforceSingle('.preset-storage-chip');

      const info=$('license_domain_text');
      if(info){ const dm=val('license_bound_domain'); info.textContent=dm||'Chưa có'; }
      const exp=$('license_expires_text');
      if(exp){ const ex=String(val('license_expires_at')||'').trim(); exp.textContent=ex||'LifeTime'; }
      const addAccountBtn=$('btn_add_account');
      if(addAccountBtn){addAccountBtn.disabled=false; addAccountBtn.title='';}

      const subtitleWarn=$('plan_feature_notice');
      if(subtitleWarn){ subtitleWarn.style.display=isPremium?'none':'block'; subtitleWarn.textContent='Các mục có nhãn Premium sẽ phụ thuộc quyền đang cấp từ license server.'; }
      const pHint=$('preset_trial_hint');
      if(pHint){ pHint.textContent=canHighQuality?tr('Layout giống cấu hình upload để chỉnh nhanh','Layout matches upload configuration for quick editing'):tr('Preset sẽ bị giới hạn theo feature đang cấp cho license hiện tại (Trial mặc định tối đa 1080p).','Preset is limited by current license features (Trial defaults to max 1080p).'); }
    }
    function renderLicenseStatus(){
      const plan=(val('license_plan')||'trial').toUpperCase();
      if($('license_status_text')) $('license_status_text').textContent=plan;
      applyLicensePlanUI();
    }
    async function activateLicenseNow(){
      try{
        const key=val('license_key_input');
        if(!key) return alert(tr('Anh nhập license key trước','Please enter the license key first'));
        const rs=await apiJson(`${api}/license/activate`,{method:'POST',body:JSON.stringify({license_key:key,domain:location.hostname})});
        const d=rs.data||{};
        if($('license_status')) $('license_status').value=d.license_status||'trial';
        if($('license_bound_domain')) $('license_bound_domain').value=d.license_bound_domain||'';
        if($('license_last_check_at')) $('license_last_check_at').value=d.license_last_check_at||'';
        if($('license_expires_at')) $('license_expires_at').value=d.license_expires_at||'';
        if($('license_plan')) $('license_plan').value=d.plan||'trial';
        if($('license_features_json')) $('license_features_json').value=JSON.stringify(d.features||{});
        renderLicenseStatus();
        await loadSettings();
        alert(rs.message||tr('Đã kích hoạt','Activated'));
      }catch(e){alert(e.message)}
    }
    async function reloadLicenseFeaturesNow(){
      try{
        const rs=await apiJson(`${api}/license/refresh`,{method:'POST'});
        const d=rs.data||{};
        if($('license_status')) $('license_status').value=d.license_status||'trial';
        if($('license_bound_domain')) $('license_bound_domain').value=d.license_bound_domain||'';
        if($('license_last_check_at')) $('license_last_check_at').value=d.license_last_check_at||'';
        if($('license_expires_at')) $('license_expires_at').value=d.license_expires_at||'';
        if($('license_plan')) $('license_plan').value=d.license_plan||'trial';
        if($('license_features_json')) $('license_features_json').value=d.license_features_json||'{}';
        renderLicenseStatus();
        autoApplyPresetOnUpload();
        refreshSubtitleUi();
        alert(tr('Đã reload quyền license','License permissions reloaded'));
      }catch(e){alert(e.message)}
    }
    function syncScaleModeUi(){const mode=((val('ffmpeg_scale_mode')||'').toLowerCase()||'pad'); if($('ffmpeg_scale_pad_enabled')) $('ffmpeg_scale_pad_enabled').value=(mode==='pad'?'1':'0'); syncHiddenSwitch('ffmpeg_scale_pad_enabled');}
    async function loadSettings(){try{const rs=await apiJson(`${api}/settings`); const d=rs.data||{}; const uploadApiBase=String(d.upload_api_base||'').trim(); if(uploadApiBase){const cleaned=uploadApiBase.replace(/\/+$/,''); uploadApi=(cleaned.endsWith('/api')?cleaned:(cleaned+'/api'));} else { uploadApi='/api'; } Object.entries(d).forEach(([k,v])=>{const el=$(k); if(el) el.value=(typeof v==='boolean'?(v?'1':'0'):(v??''))}); if($('jw_custom_library_url')) $('jw_custom_library_url').value=String(d.embed_jw_library_url||''); if($('jw_custom_plugin_urls')) $('jw_custom_plugin_urls').value=String(d.embed_jw_plugin_urls||''); if($('jw_custom_setup_json')) $('jw_custom_setup_json').value=String(d.embed_jw_setup_json||''); if($('license_plan')) $('license_plan').value=(d.license_plan||'trial'); if($('license_features_json')) $('license_features_json').value=(d.license_features_json||'{}'); if($('license_current_key_text')) $('license_current_key_text').textContent=(d.license_key_display||'Chưa có'); if($('license_key_input')) $('license_key_input').value=''; if(!val('ffmpeg_preset')) $('ffmpeg_preset').value='fast'; if(!val('ffmpeg_fps')) $('ffmpeg_fps').value='24'; if(!val('ffmpeg_threads')) $('ffmpeg_threads').value='2'; if(!val('hls_segment_duration')) $('hls_segment_duration').value='10'; if(!val('ffmpeg_scale_pad_enabled')) $('ffmpeg_scale_pad_enabled').value='1'; try{const hc=JSON.parse(String(d.embed_hlsjs_config_json||'{}')); if($('hlsjs_max_buffer_length')) $('hlsjs_max_buffer_length').value=String(hc.maxBufferLength??30); if($('hlsjs_max_max_buffer_length')) $('hlsjs_max_max_buffer_length').value=String(hc.maxMaxBufferLength??600); if($('hlsjs_back_buffer_length')) $('hlsjs_back_buffer_length').value=String(hc.backBufferLength??30); if($('hlsjs_max_buffer_hole')) $('hlsjs_max_buffer_hole').value=String(hc.maxBufferHole??0.5); if($('hlsjs_start_prefetch')) $('hlsjs_start_prefetch').value=(hc.startFragPrefetch?'1':'0'); if($('multi_server_list_position')) $('multi_server_list_position').value=String(hc.multiServerListPosition||'outside-bottom'); if($('multi_server_list_css')) $('multi_server_list_css').value=String(hc.multiServerListCss||''); if($('multi_server_list_js')) $('multi_server_list_js').value=String(hc.multiServerListJs||''); if($('thumbnail_max_width')) $('thumbnail_max_width').value=String(hc.thumbnailMaxWidth??720); if(!d.ffmpeg_scale_mode && $('ffmpeg_scale_mode')) $('ffmpeg_scale_mode').value=String(hc.ffmpegScaleMode||'');}catch(e){} if($('ffmpeg_scale_mode')) $('ffmpeg_scale_mode').value=(d.ffmpeg_scale_mode || val('ffmpeg_scale_mode') || (val('ffmpeg_scale_pad_enabled')==='1'?'pad':'fit')); syncScaleModeUi(); ['local_mode_enabled','ftp_multi_enabled','ftp_round_robin_enabled','ftp_fallback_enabled','ftp_mode_enabled','r2_multi_enabled','r2_round_robin_enabled','r2_fallback_enabled','r2_mode_enabled','b2_multi_enabled','b2_round_robin_enabled','b2_fallback_enabled','b2_mode_enabled','gdrive_multi_enabled','gdrive_round_robin_enabled','gdrive_fallback_enabled','gdrive_mode_enabled','ttb_multi_enabled','ttb_round_robin_enabled','ttb_fallback_enabled','ttb_mode_enabled','delete_sync_storage','embed_strict_mode','ffmpeg_scale_pad_enabled','hlsjs_start_prefetch'].forEach(syncHiddenSwitch); renderStorageAccountPanels(); const storage=(d.storage_mode||'--').toUpperCase().replace('TTB','TIKTOK'); if($('stat-storage')) $('stat-storage').textContent=storage; if($('ov-storage')) $('ov-storage').textContent=storage; toggleStorageFields(); renderCategoryManager(); renderCategoryOptions(); renderEmbedWatermarkRules(); renderLicenseStatus(); if($('account_username')) $('account_username').value=(d.admin_username||'admin'); const wu=$('welcome_user_text'); if(wu) wu.textContent='Welcome, '+(d.admin_username||'admin')+'!'; const lb=$('license_badge_overview'); if(lb){const pl=String(d.license_plan||'trial').toLowerCase(); lb.textContent=pl==='premium'?'Premium':'Trial'; if(pl==='premium'){lb.style.background='#dcfce7';lb.style.color='#166534';lb.style.borderColor='#86efac';}else{lb.style.background='#fef3c7';lb.style.color='#92400e';lb.style.borderColor='#fde68a';}} const versionText='Version v'+String(d.license_config_version||'1.0.0'); const lcv=$('license-config-version'); if(lcv){lcv.textContent=versionText;} const pvt=$('patch_version_text'); if(pvt){pvt.textContent=versionText;} autoApplyPresetOnUpload(); renderHealthCheckBoard(); renderFfmpegThreadsHint()}catch(e){ if(e?.status===401){showAuthOverlay('Vui lòng đăng nhập admin'); return;} log('Load settings lỗi: '+e.message)}}
    let autoSaveTimer=null,autoSaving=false;
    function showAuthOverlay(msg=''){const o=$('authOverlay'); if(o) o.classList.add('show'); $('appShell')?.classList.add('auth-hidden'); if($('auth_error')) $('auth_error').textContent=msg||'';}
    function hideAuthOverlay(){const o=$('authOverlay'); if(o) o.classList.remove('show'); $('appShell')?.classList.remove('auth-hidden'); if($('auth_error')) $('auth_error').textContent='';}
    async function ensureAuthAndBoot(){
      try{
        await apiJson(`${api}/license/status`);
        hideAuthOverlay();
        await loadSettings(); await loadVideos(); await loadHistory(); await loadPatchStatus();
      }catch(e){
        showAuthOverlay('Vui lòng đăng nhập admin');
      }
    }
    async function adminLoginSubmit(){
      try{
        const username=val('auth_username')||'admin';
        const password=String($('auth_password')?.value||'');
        if(!password) return showAuthOverlay('Anh nhập mật khẩu');
        const rs=await apiJson(`${api}/auth/login`,{method:'POST',body:JSON.stringify({username,password})});
        const tk=rs?.data?.token||''; if(!tk) throw new Error('Không nhận được token');
        localStorage.setItem(AUTH_TOKEN_KEY,tk);
        hideAuthOverlay();
        location.reload();
      }catch(e){showAuthOverlay(e.message||'Đăng nhập thất bại');}
    }
