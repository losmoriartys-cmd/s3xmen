/* LOS S3X-MEN COMMAND CENTER 2.0 - progressive enhancement */
(function(){
  "use strict";
  const tabs=[...document.querySelectorAll(".tab-btn[data-tab]")];
  function activateTab(id){
    const panel=document.getElementById(id);
    if(!panel)return;
    document.querySelectorAll(".tab-content").forEach(el=>el.classList.toggle("active",el.id===id));
    tabs.forEach(btn=>{const active=btn.dataset.tab===id;btn.classList.toggle("active",active);btn.setAttribute("aria-selected",String(active));});
    const list=document.getElementById("streamers-list-view");
    if(list)list.style.display="block";
    document.querySelectorAll(".single-profile").forEach(el=>el.classList.remove("active"));
    if(history.replaceState)history.replaceState(null,"","#"+id);
  }
  tabs.forEach(btn=>btn.addEventListener("click",()=>activateTab(btn.dataset.tab)));
  document.querySelectorAll("[data-go-tab]").forEach(btn=>btn.addEventListener("click",()=>activateTab(btn.dataset.goTab)));
  document.querySelectorAll(".streamer-preview-card").forEach(card=>{
    card.setAttribute("tabindex","0");card.setAttribute("role","button");
    card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();card.click();}});
  });
  const form=document.getElementById("join-form"),result=document.getElementById("join-result"),actions=document.getElementById("join-actions"),copy=document.getElementById("copy-application");
  let applicationText="";
  if(form){
    form.addEventListener("submit",e=>{
      e.preventDefault();
      if(!form.reportValidity())return;
      const d=new FormData(form);
      applicationText=[
        "POSTULACIÓN — LOS S3X-MEN",
        "Nombre/alias: "+d.get("name"),
        "Canal: "+d.get("channel"),
        "País: "+d.get("country"),
        "Email: "+d.get("email"),
        "Horas de directo por semana: "+(d.get("hours")||"No indicado"),
        "Juegos/categorías: "+d.get("games"),
        "Sobre el creador: "+d.get("about"),
        "Otras redes: "+(d.get("links")||"No indicadas"),
        "Consentimiento: Sí"
      ].join("\n");
      result.hidden=false;actions.hidden=false;
      result.textContent="Tu postulación está preparada. Copiá el resumen y envialo al contacto oficial del equipo. Esta web todavía no transmite ni guarda solicitudes.";
    });
    copy?.addEventListener("click",async()=>{
      if(!applicationText)return;
      try{await navigator.clipboard.writeText(applicationText);copy.textContent="Copiado";}catch(err){result.textContent=applicationText;copy.textContent="Seleccioná y copiá el texto mostrado";}
    });
  }

  // The legacy profile cards contain manually entered, undated metrics.
  // Suppress those values until a source-backed Twitch/SullyGnome sync exists.
  document.querySelectorAll(".single-profile").forEach(profile=>{
    profile.querySelectorAll(".metrics-grid").forEach(grid=>{
      const notice=document.createElement("div");
      notice.className="cc-note";
      notice.textContent="Métricas en revisión: los valores anteriores eran manuales y no tenían una fecha de actualización verificable. Se publicarán nuevamente cuando exista una fuente y un período de medición documentados.";
      grid.replaceWith(notice);
    });
    profile.querySelectorAll(".profile-box").forEach(box=>{
      const heading=box.querySelector("h4");
      if(heading&&/Métricas de Audiencia/i.test(heading.textContent)){
        box.innerHTML="<h4>Estado de métricas</h4><p class='cc-muted'>Datos históricos retirados de la vista pública hasta su validación con una fuente actualizada.</p>";
      }
    });
  });
  const hash=location.hash.replace("#","");
  if(hash&&document.getElementById(hash)?.classList.contains("tab-content"))activateTab(hash);
})();
