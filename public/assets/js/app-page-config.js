function switchConfigTab(tab){
      ['basic','video','advanced'].forEach(x=>{$('cfg-tab-'+x)?.classList.toggle('active', x===tab)});
      const sec=$('section-config'); if(sec) sec.setAttribute('data-config-current', tab);

      const mount=$('config_video_mount');
      const left=$('config_video_left');
      const right=$('config_video_right');

      document.querySelectorAll('#section-config .config-group').forEach(el=>{el.style.display=(el.getAttribute('data-config-tab')===tab)?'block':'none';});
      document.querySelectorAll('#section-config .settings-account-grid > div').forEach(col=>{col.style.display='block'; col.style.gridColumn=''; col.style.gridRow='';});

      if(tab==='video'){
        if(mount) mount.style.display='grid';
        const ff=$('cfg_ffmpeg_panel'); const hls=$('hls_buffer_panel'); const del=$('delete_sync_panel'); const player=$('player_settings_panel');
        if(left && ff) left.appendChild(ff);
        if(left && hls) left.appendChild(hls);
        if(left && del) left.appendChild(del);
        if(right && player) right.appendChild(player);
        document.querySelectorAll('#section-config .settings-account-grid > div').forEach(col=>{
          const hasVisible=[...col.querySelectorAll('.config-group')].some(el=>el.style.display!=='none');
          col.style.display=hasVisible?'block':'none';
        });
      } else {
        if(mount) mount.style.display='none';
        const cols=[...document.querySelectorAll('#section-config .settings-account-grid > div')];
        if(cols.length>=3){
          const c1=cols[0], c2=cols[1], c3=cols[2];
          const mode=$('cfg_mode_panel'), preset=$('cfg_preset_panel'), cat=$('cfg_category_panel'), ff=$('cfg_ffmpeg_panel'), hls=$('hls_buffer_panel'), player=$('player_settings_panel'), uploadNet=$('upload_network_panel'), embed=document.querySelector('#section-config .config-group[data-config-tab="advanced"]:not(#delete_sync_panel):not(#patch_update_panel):not(#upload_network_panel)'), del=$('delete_sync_panel'), patch=$('patch_update_panel');
          if(tab==='basic'){
            const thumb=$('thumb_size_panel');
            if(mode) c1.appendChild(mode);
            if(preset) c2.appendChild(preset);
            if(thumb) c2.appendChild(thumb);
            if(cat) c3.appendChild(cat);
            if(del) c3.appendChild(del);
            if(ff) c2.appendChild(ff);
            if(hls) c2.appendChild(hls);
          }else{
            if(mode) c1.appendChild(mode); if(preset) c1.appendChild(preset);
            if(cat) c2.appendChild(cat); if(ff) c2.appendChild(ff); if(hls) c2.appendChild(hls);
          }

          if(tab==='advanced'){
            if(embed) c1.appendChild(embed);
            if(uploadNet) c3.appendChild(uploadNet);
            if(patch) c3.appendChild(patch);
            if(player) c3.appendChild(player);
            if(del) c3.appendChild(del);
            const mobileView = window.matchMedia('(max-width: 900px)').matches;
            if(mobileView){
              c1.style.display='block';
              c1.style.gridColumn='1 / span 1';
              c1.style.gridRow='1';
              c2.style.display='none';
              c3.style.display='block';
              c3.style.gridColumn='1 / span 1';
              c3.style.gridRow='2';
            }else{
              c1.style.display='block';
              c1.style.gridColumn='1 / span 2';
              c1.style.gridRow='1';
              c2.style.display='none';
              c3.style.display='block';
              c3.style.gridColumn='3 / span 1';
              c3.style.gridRow='1';
            }
          }else{
            if(player) c3.appendChild(player);
            if(uploadNet) c3.appendChild(uploadNet);
            if(embed) c3.appendChild(embed);
            if(tab!=='basic' && del) c3.appendChild(del);
            if(patch) c3.appendChild(patch);
            document.querySelectorAll('#section-config .settings-account-grid > div').forEach(col=>{
              const hasVisible=[...col.querySelectorAll('.config-group')].some(el=>el.style.display!=='none');
              col.style.display=hasVisible?'block':'none';
            });
          }
        }
      }
    }
