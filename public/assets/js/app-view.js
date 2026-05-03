let currentViewMode='';
    async function refreshViewData(mode){
      try{
        if(mode==='overview'){ await loadSystemStatus(); }
        else if(mode==='history'){ await loadHistory(); }
        else if(mode==='library'){ await loadVideos(currentVideoPage||1); }
        else if(mode==='settings'){ await loadSettings(); }
        else if(mode==='config'){ await loadSettings(); renderPresetManager(); renderCategoryManager(); renderCategoryOptions(); renderEmbedWatermarkRules(); renderFfmpegThreadsHint?.(); }
        else if(mode==='account'){ await loadSettings(); }
      }catch(e){}
    }
    function goPage(page){
      const map={overview:'/app',history:'/app/history',import:'/app/import',library:'/app/library',settings:'/app/storage',config:'/app/config',account:'/app/account'};
      const target=map[page]||'/app';
      if(location.pathname!==target){ history.pushState({page},'',target); }
      setView(page||detectPage());
      applyI18n?.();
    }

    function setView(mode){
      ['overview','history','import','library','settings','config','account'].forEach(x=>{const n=$('nav-'+x); if(n) n.classList.toggle('active',x===mode)});
      const a=$('section-import'),hist=$('section-history'),b=$('section-settings'),cfg=$('section-config'),acc=$('section-account'),c=$('section-player'),d=$('section-library');
      const h=$('section-hero'),s=$('section-stats'),ov=$('section-overview-summary');
      const ph=$('page-header'),pht=$('page-header-title'),phc=$('page-header-crumb');
      const grid=document.querySelector('.grid');
      [a,hist,b,cfg,acc,c,d,h,s,ov].forEach(x=>x&&(x.style.display='none'));
      if(grid) grid.classList.remove('library-layout');

      const pageMeta={
        import:{title:tr('page.import','Import / Upload Video'),crumb:tr('page.import','Import / Upload Video')},
        history:{title:tr('page.history','Log'),crumb:tr('page.history','Log')},
        library:{title:tr('page.library','Danh sách Video'),crumb:tr('page.library','Danh sách Video')},
        settings:{title:tr('page.settings','Lưu Trữ'),crumb:tr('page.settings','Lưu Trữ')},
        config:{title:tr('page.config','Cấu Hình'),crumb:tr('page.config','Cấu Hình')},
        account:{title:tr('page.account','Tài Khoản'),crumb:tr('page.account','Tài Khoản')},
        overview:{title:tr('page.overview','Tổng quan'),crumb:tr('page.overview','Tổng quan')}
      };
      const meta=pageMeta[mode]||pageMeta.overview;
      if(pht) pht.textContent=meta.title;
      if(phc) phc.textContent=meta.crumb;

      const modeChanged=(currentViewMode!==mode);
      currentViewMode=mode;

      if(mode==='import'){
        if(ph) ph.style.display='flex';
        a.style.display='block';
      }else if(mode==='history'){
        if(ph) ph.style.display='flex';
        hist.style.display='block';
      }else if(mode==='library'){
        if(ph) ph.style.display='flex';
        if(grid) grid.classList.add('library-layout');
        d.style.display='block';
      }else if(mode==='settings'){
        if(ph) ph.style.display='flex';
        b.style.display='block';
      }else if(mode==='config'){
        if(ph) ph.style.display='flex';
        cfg.style.display='block';
        switchConfigTab('basic');
      }else if(mode==='account'){
        if(ph) ph.style.display='flex';
        acc.style.display='block';
      }else{
        if(ph) ph.style.display='none';
        h.style.display='grid';
        s.style.display='grid';
        ov.style.display='block';
      }
      if(modeChanged) setTimeout(()=>refreshViewData(mode),0);
    }
