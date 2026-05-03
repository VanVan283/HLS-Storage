function normalizeUiText(s){
      let out=String(s||'').replace(/TTB/gi,'TikTok');
      if(currentLang==='en'){
        try{ Object.entries(I18N_PHRASES_EN||{}).forEach(([vi,en])=>{ out=out.split(vi).join(en); }); }catch(e){}
      }
      return out;
    }
    function log(m){$('logs').textContent=`[${new Date().toLocaleTimeString()}] ${normalizeUiText(m)}\n`+$('logs').textContent}
    function esc(s){return (s||'').toString().replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}

    async function apiJson(url,opt={}){
      const headers={...(opt.headers||{})}; const tk=localStorage.getItem(AUTH_TOKEN_KEY)||''; if(tk && !headers['Authorization']) headers['Authorization']='Bearer '+tk; if(!(opt.body instanceof FormData)&&!headers['Content-Type']) headers['Content-Type']='application/json';
      const res=await fetch(url,{...opt,headers}); const text=await res.text(); let j;
      try{j=JSON.parse(text)}catch{j={message:(text||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,300)||`HTTP ${res.status}`}}
      if(!res.ok){
        const details=(j&&j.errors&&typeof j.errors==='object')?Object.values(j.errors).flat().join(' • '):'';
        const e=new Error(j.message||details||`HTTP ${res.status}`); e.status=res.status; throw e;
      }
      return j;
    }

    function formatDuration(v){const n=Number(v); if(!Number.isFinite(n)||n<=0) return '-'; const sec=Math.round(n); const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60; if(h>0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; return `${m}:${String(s).padStart(2,'0')}`}
    function formatBytes(bytes){const n=Number(bytes||0); if(!n) return '-'; const u=['B','KB','MB','GB','TB']; let i=0,v=n; while(v>=1024&&i<u.length-1){v/=1024;i++} return `${v>=100||i===0?Math.round(v):v.toFixed(1)} ${u[i]}`}
    function formatDateTime(v){if(!v) return '-'; const d=new Date(v); if(Number.isNaN(d.getTime())) return v; return d.toLocaleString('vi-VN')}
    function detectStorageSource(v){
      const mode=String(v?.storage_mode||'').toLowerCase();
      if(mode==='ttb') return 'TikTok';
      if(mode==='gdrive') return 'Google Drive';
      if(mode==='r2') return 'Cloudflare R2';
      if(mode==='b2') return 'Backblaze B2';
      if(mode==='ftp') return 'FTP';
      if(mode==='local') return 'Local';
      const p=(v?.path||'').toLowerCase();
      if(p.startsWith('ttb://')) return 'TikTok';
      if(p.startsWith('gdrive://')) return 'Google Drive';
      if(p.startsWith('r2://')) return 'Cloudflare R2';
      if(p.startsWith('b2://')) return 'Backblaze B2';
      if(p.startsWith('ftp://')) return 'FTP';
      if(p.startsWith('http://')||p.startsWith('https://')) return 'Remote URL';
      return 'Local'
    }
    function renderStorageSourceCell(v){
      const src=detectStorageSource(v);
      const pickIcon=(name)=>name==='TikTok'?'https://cdn.simpleicons.org/tiktok':(name==='Google Drive'?'https://cdn.simpleicons.org/googledrive':(name==='Cloudflare R2'?'https://cdn.simpleicons.org/cloudflare':(name==='Backblaze B2'?'https://cdn.simpleicons.org/backblaze':(name==='FTP'?'https://cdn.simpleicons.org/filezilla':'https://cdn.simpleicons.org/files'))));
      const normalized=String(src||'').trim();
      const parts=normalized.split(/\s*[,/|+]\s*/).filter(Boolean);
      const sources=parts.length?parts:[normalized||'Local'];
      const unique=[]; sources.forEach(x=>{if(!unique.includes(x)) unique.push(x)});
      return `<div style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;flex-wrap:wrap" title="${esc(normalized||'Local')}">${unique.map(name=>`<span class=\"platform-icon\"><img src=\"${pickIcon(name)}\" alt=\"${esc(name)}\"></span>`).join('')}</div>`;
    }
    function getOriginalFileMeta(v){const raw=v?.original_storage_json; if(!raw) return null; let meta=null; if(typeof raw==='object') meta=raw; else { try{meta=JSON.parse(raw)}catch(e){meta=null} } if(!meta||typeof meta!=='object') return null; const ignore=['non_hls_subtitle_sidecar','non_hls_subtitle_storage','subtitle_attached','ftp_hls_prefix','ftp_hls_files']; const keys=Object.keys(meta).filter(k=>!ignore.includes(k)); if(keys.length===0) return null; return meta}
    function renderOriginalFileCell(v){const meta=getOriginalFileMeta(v); if(!meta) return `<span class="mini-badge idle">${tr('Không','No')}</span>`; return `<button class="btn-mini soft" type="button" onclick='showOriginalFileInfo(${JSON.stringify(JSON.stringify(meta)).replace(/'/g,"&#39;")})'>${tr('Xem','View')}</button>`}
