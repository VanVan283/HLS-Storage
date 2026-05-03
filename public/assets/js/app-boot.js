chooseSourceTab('file');
    if(window.Notification && Notification.permission==='default'){try{Notification.requestPermission()}catch(e){}}
    const savedJob=getSavedActiveJob();
    if(savedJob){showBgBadge('Đang khôi phục tiến trình nền...','Đang lấy dữ liệu job trước đó',0); pollJobStatus(savedJob)}
    restoreUploadQueue(); loadSystemStatus(); renderPresetManager(); updateWelcomeTime(); setInterval(updateWelcomeTime,1000); renderUploadQueue(); renderCategoryManager(); renderCategoryOptions(); renderEmbedWatermarkRules(); autoApplyPresetOnUpload(); refreshSelectedUploadFiles(); updateOriginalStorageField(); setView(detectPage()); applyI18n();
    window.addEventListener('popstate',()=>{ setView(detectPage()); applyI18n?.(); });
    setInterval(()=>{ if(currentLang==='en') applyPhraseI18n(); }, 1200);
    refreshSubtitleUi(); ensureAuthAndBoot();
    setInterval(pruneFinishedUploadQueue, 60 * 1000);
    ['local_path','upload_api_base','upload_chunk_mb','ftp_hostname','ftp_port','ftp_user','ftp_pass','ftp_path','r2_bucket','r2_key','r2_secret','r2_endpoint','b2_bucket','b2_key','b2_secret','b2_endpoint','gdrive_client_id','gdrive_client_secret','gdrive_redirect_uri','gdrive_shared_drive_id','gdrive_mode','storage_mode','embed_domain_whitelist','embed_host_aliases','embed_player_type','embed_vast_url','embed_vmap_url','embed_custom_html','embed_custom_css','embed_custom_js','embed_watermark_rules_json','ffmpeg_preset','ffmpeg_fps','ffmpeg_threads','hls_segment_duration','hlsjs_max_buffer_length','hlsjs_max_max_buffer_length','hlsjs_back_buffer_length','hlsjs_max_buffer_hole'].forEach(id=>{$(id)?.addEventListener('change',()=>queueAutoSave()); $(id)?.addEventListener('input',()=>queueAutoSave())});
    $('upload_file')?.addEventListener('change',refreshSelectedUploadFiles);
    $('subtitle_file')?.addEventListener('change',refreshSelectedUploadFiles);
    $('embed_watermark_rules_json')?.addEventListener('input',()=>{renderEmbedWatermarkRules(); queueAutoSave();});
    $('auth_password')?.addEventListener('keydown',(e)=>{if(e.key==='Enter') adminLoginSubmit();});
    $('support_telegram_btn')?.addEventListener('click',()=>{const u=val('support_telegram_url')||''; if(!u) return alert('Chưa cấu hình link Telegram support'); window.open(u,'_blank');});
    $('support_facebook_btn')?.addEventListener('click',()=>{const u=val('support_facebook_url')||''; if(!u) return alert('Chưa cấu hình link Facebook support'); window.open(u,'_blank');});
    document.querySelectorAll('.storage-chip,.preset-storage-chip').forEach(ch=>ch.addEventListener('change',()=>{
      const plan=(val('license_plan')||'trial').toLowerCase();
      if(plan==='premium') return;
      const cls=ch.classList.contains('preset-storage-chip')?'.preset-storage-chip':'.storage-chip';
      const checked=[...document.querySelectorAll(cls+':checked')];
      if(checked.length>1){ checked.forEach((x,i)=>{ if(i>0) x.checked=false; }); }
    }));

    $('dark_mode_toggle')?.addEventListener('click',toggleDarkMode);
