function toggleStorageFields(){const m=$('storage_mode')?.value||'local'; if($('localFields')) $('localFields').style.display=m==='local'?'block':'none'; if($('ftpFields')) $('ftpFields').style.display=m==='ftp'?'block':'none'; if($('r2Fields')) $('r2Fields').style.display=m==='r2'?'block':'none'; if($('gdriveFields')) $('gdriveFields').style.display=m==='gdrive'?'block':'none'}

function renderHealthCheckBoard(){
      const root=$('healthCheckBoard'); if(!root) return;
      const cards=[];
      [
        ['local','https://cdn.simpleicons.org/files','Local'],
        ['ftp','https://cdn.simpleicons.org/filezilla','FTP'],
        ['r2','https://cdn.simpleicons.org/cloudflare','Cloudflare R2'],
        ['b2','https://cdn.simpleicons.org/backblaze','Backblaze B2'],
        ['gdrive','https://cdn.simpleicons.org/googledrive','Google Drive'],
        ['ttb','https://cdn.simpleicons.org/tiktok','TikTok']
      ].forEach(([m,icon,label])=>{
        const on=(val(m+'_mode_enabled')||'1')==='1';
        cards.push({icon,title:label,status:on?'ok':'off',meta:on?tr('Mode đang bật','Mode enabled'):tr('Mode đang tắt','Mode disabled')});
      });
      root.innerHTML=`<div class="health-grid">${cards.map(c=>{const st=c.status||'warn'; const txt=st==='ok'?tr('Hoạt động','Active'):(st==='off'?tr('Đang tắt','Disabled'):tr('Cần kiểm tra','Needs attention')); return `<div class="health-card"><div class="health-title"><span class="platform-icon"><img src="${c.icon}" alt="${esc(c.title)}"></span><span>${esc(c.title)}</span></div><div class="health-meta">${esc(c.meta)}</div><div class="health-badge ${st}">${txt}</div></div>`;}).join('')}</div>`;
    }
