// psicoed-screens.jsx — Pantallas de la App Psicoeducativa (3 perfiles, theme-driven)
const { useState, useEffect, useMemo, useRef } = React;

// ─── Datos demo ──────────────────────────────────────────────────
const PILOTO = !!(typeof window!=='undefined' && window.PSICO_PILOTO);
const ESTUDIANTES = PILOTO ? [] : [
  { id:'e1', nombre:'Sofía Contreras', curso:'3°A Básico', diag:'TEA (Trastorno del Espectro Autista)', plan:'PACI', estado:'vigente', edad:'8 años', prof:'Educ. Diferencial', avance:100 },
  { id:'e2', nombre:'Benjamín Soto', curso:'5°B Básico', diag:'TDAH combinado', plan:'PAI', estado:'borrador', edad:'10 años', prof:'Psicología', avance:60 },
  { id:'e3', nombre:'Isidora Vera', curso:'I°A Medio', diag:'Trastorno ansioso', plan:'Plan Salud Mental', estado:'vigente', edad:'14 años', prof:'Psicología', avance:100 },
  { id:'e4', nombre:'Martín Rojas', curso:'5°B Básico', diag:'Por evaluar · informe recién recibido', plan:'—', estado:'pendiente', edad:'10 años', prof:'—', avance:0 },
  { id:'e5', nombre:'Florencia Díaz', curso:'7°A Básico', diag:'Discapacidad intelectual leve', plan:'PACI', estado:'vigente', edad:'12 años', prof:'Educ. Diferencial', avance:100 },
];

const PLANES = [
  { id:'PAI', nombre:'P.A.I.', full:'Plan de Acompañamiento Individual' },
  { id:'PACI', nombre:'P.A.C.I.', full:'Plan de Adecuación Curricular Individual' },
  { id:'PAEC', nombre:'P.A.E.C.', full:'Plan de Adecuación Evaluativa Curricular' },
  { id:'PSM', nombre:'Plan Salud Mental', full:'Plan Curricular Salud Mental' },
];

// adecuaciones evaluativas (para el P.A.E.C.)
const ADEC_EVAL = [
  { tipo:'Formato de la evaluación', items:['Ampliar el tamaño de letra del instrumento','Reducir el número de ítems por página','Destacar las instrucciones clave','Usar apoyos visuales o pictogramas en los enunciados'] },
  { tipo:'Tiempo y administración', items:['Otorgar tiempo adicional','Fraccionar la evaluación en sesiones','Aplicar en un espacio sin distractores','Permitir pausas durante la evaluación'] },
  { tipo:'Formas de respuesta', items:['Permitir respuesta oral','Uso de PC o tablet para responder','Selección múltiple en vez de desarrollo','Apoyo de un mediador para registrar respuestas'] },
  { tipo:'Criterios de calificación', items:['Ponderar según objetivos priorizados','Evaluación diferenciada por asignatura','Valorar el proceso y no solo el resultado','Rúbricas adaptadas al estudiante'] },
];

// adecuaciones de acceso — TEXTO OFICIAL EXACTO del P.A.I. Colegio Mayor
// adecuaciones de acceso — TEXTO OFICIAL EXACTO del P.A.I. Colegio Mayor
const ADEC_ACCESO = [
  { tipo:'Presentación y representación de la información (Auditiva, Visual, Corporal y táctil).', items:['Ampliación de la letra, imágenes, palabra o sonido.','Uso de contrastes y color para resaltar información.','Videos o animaciones.','Uso de ayudas técnicas (Lupa, recursos multimedia, amplificación de audio).','Destacar en el enunciado las acciones que el/la estudiante deberá realizar (ej.: subraya, une, escribe, rodea con color, marca, etc.).','Uso de textos hablados.','Medios audiovisuales.','Uso de calendarios o agendas.','Lenguaje gestual.','Uso de pictogramas para instrucciones dirigidas y simples, destacando la acción/verbo a ejecutar.','Mediar, con apoyo concreto/visual, preguntas de relaciones espaciales y de comprensión.','Mapas conceptuales.','Uso de material concreto para aclarar enunciados que requieren abstracción.'] },
  { tipo:'Medios de ejecución y expresión', items:['A través de un PC, Tablet.','Texto escrito.','Sistema de Comunicación Alternativo.','Música y/o expresión corporal.','Uso de calculadora.','Exposición oral/video.','Dramatizaciones.','Flexibilidad en desempeño de la ejecución grafomotriz (calidad y tipo de la letra).','No se evalúa errores ortográficos.','Complementar el registro escrito con respuestas orales, en caso de ser necesario.','Evaluación mixta: complementar evaluaciones (escritas, orales, expresión artística, maqueta, exposiciones, videos, etc.).','Mediar en la detección de errores y confusiones para que el estudiante pueda realizar autocorrección.'] },
  { tipo:'Proporcionar múltiples medios de participación y compromiso', items:['Trabajo colaborativo.','Trabajo individual.','Investigaciones.','Participación en talleres.'] },
  { tipo:'Entorno (Adecuación en los espacios, ubicación y condiciones)', items:['Ubicación en lugar estratégico.','Ruido ambiental.','Luminosidad.','Rampas de acceso.','Realizar consolidaciones o trabajos en sala del equipo biblioteca, previa coordinación con P.T. (en caso de que sea necesario).'] },
  { tipo:'Organización del tiempo y el horario', items:['En la tarea o actividad.','En la evaluación.','Tiempo fuera.','Pausas activas.','Cambio de jornada para rendir evaluación.','Reducción de jornada (solicitada por apoderado/a).'] },
  { tipo:'Estrategias socioemocionales', items:['Apoyo en gestión de las emociones.','Contención emocional.','Apoyo en resolución de conflicto.','Técnicas de relajación.','Uso de sala de calma.'] },
];
const RESPONSABLES = ['P. de asignatura','P. diferencial','P. tutor','T. ocupacional','Psicóloga'];

// adecuaciones de acceso del PLAN CURRICULAR SALUD MENTAL — EXACTO (4 grupos)
const ADEC_PSM = [
  { tipo:'Proporcionar múltiples medios de participación y compromiso', items:['Trabajo colaborativo.','Trabajo individual.','Investigaciones.','Participación en talleres.'] },
  { tipo:'Entorno (Adecuación en los espacios, ubicación y condiciones)', items:['Ubicación en lugar estratégico.','Ruido ambiental.','Luminosidad.','Rampas de acceso.','Realizar consolidaciones o trabajos en sala del equipo biblioteca, previa coordinación con P.T. (en caso de que sea necesario).'] },
  { tipo:'Organización del tiempo y el horario', items:['En la tarea o actividad.','En la evaluación.','Tiempo fuera.','Pausas activas.','Cambio de jornada para rendir evaluación.','Reducción de jornada (solicitada por apoderado/a).'] },
  { tipo:'Estrategias socioemocionales', items:['Apoyo en gestión de las emociones.','Contención emocional.','Apoyo en resolución de conflicto.','Técnicas de relajación.','Uso de sala de calma.'] },
];

// adecuaciones en los objetivos de aprendizaje — EXACTO del P.A.C.I.
const PACI_TIPOS_COMUNES = [
  { g:'Graduación del nivel de complejidad', items:['Plantear objetivos alcanzables','Metas pequeñas','Metas amplias','Otros (Indique)'] },
  { g:'Temporalización', items:['Prolongación del tiempo','Progresión de aprendizajes en espiral','Otros (Indique)'] },
  { g:'Enriquecimiento de currículum', items:['Proyectos de aula','Talleres con otros profesionales','Otros (Indique)'] },
  { g:'Eliminación de aprendizajes (última instancia)', items:['Severidad de la NEE','Nivel de dificultad de los aprendizajes esperados','OA irrelevantes para el desempeño del estudiante con NEE','Recursos y apoyos utilizados no han tenido resultados positivos','Otros (Indique)'] },
];
const PACI_ASIGNATURAS = [
  { nombre:'Lenguaje', prioriza:['Comunicación oral','Comunicación gestual','Lectura funcional','Escritura funcional','Otros (Indique)'] },
  { nombre:'Matemáticas', prioriza:['Operaciones matemáticas básicas y funcionales','Uso y manejo de dinero','Otros (Indique)'] },
  { nombre:'Ciencias', prioriza:['Conocimiento del entorno comunitario','Enfoque ecológico-funcional','Otros (Indique)'] },
  { nombre:'Historia', prioriza:['Conocimiento del entorno comunitario','Enfoque ecológico-funcional','Otros (Indique)'] },
  { nombre:'Otra asignatura: ____________', prioriza:['(Indique)'] },
];

// ─── Plan de trabajo académico (compartido Equipo ↔ Profesor) ─────
const ASIGNATURAS_7 = ['Lengua y Literatura','Inglés','Matemática','Ciencias Naturales','Historia, Geografía y Cs. Sociales','Artes Visuales','Música','Educación Tecnológica','Educación Física y Salud'];
const ASIGNATURAS_M = ['Lengua y Literatura','Inglés','Matemática','Biología','Física','Química','Historia, Geografía y Cs. Sociales','Artes Visuales','Educación Tecnológica','Educación Física y Salud'];
// Elige el plan de estudios según el curso: I°–IV° Medio vs 7°/8° Básico.
function asignaturasFor(curso){ return /medio/i.test(String(curso||'')) ? ASIGNATURAS_M : ASIGNATURAS_7; }
const PTA_TIPOS = ['Prueba','Trabajo','Guía','Disertación','Proyecto'];
// Reduce una foto grande (celular) antes de enviarla a la IA: la API rechaza
// imágenes muy pesadas ("Could not process image"). Reescala el lado largo a
// ~1568px y reencoda JPEG — sigue legible para leer el texto del informe.
function shrinkImageDataUrl(dataUrl, maxEdge){
  return new Promise((resolve)=>{
    try{
      const img=new Image();
      img.onload=()=>{ try{
        const scale=Math.min(1, maxEdge/Math.max(img.width,img.height));
        if(scale>=1 && dataUrl.length < 3200000){ resolve(dataUrl); return; }
        const cw=Math.max(1,Math.round(img.width*scale)), ch=Math.max(1,Math.round(img.height*scale));
        const c=document.createElement('canvas'); c.width=cw; c.height=ch;
        c.getContext('2d').drawImage(img,0,0,cw,ch);
        resolve(c.toDataURL('image/jpeg',0.85));
      }catch(e){ resolve(dataUrl); } };
      img.onerror=()=>resolve(dataUrl);
      img.src=dataUrl;
    }catch(e){ resolve(dataUrl); }
  });
}

// ─── Informe médico en Supabase Storage (bucket "informes") ──────────
// Sube el archivo al bucket y devuelve la ruta; si no hay nube, cae a base64.
async function subirInformeArchivo(estId, file){
  const sb = window.PSICO_SB;
  const esImagen = /^image\//.test(file.type);
  if(sb){
    let blob = file, tipo = file.type;
    if(esImagen){ try{ const du=await new Promise(r=>{ const rd=new FileReader(); rd.onload=()=>r(rd.result); rd.readAsDataURL(file); }); const small=await shrinkImageDataUrl(du,1800); const res=await fetch(small); blob=await res.blob(); tipo='image/jpeg'; }catch(_){} }
    const ext = tipo==='image/jpeg' ? 'jpg' : (file.name.split('.').pop()||'bin').toLowerCase();
    const path = `${estId}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('informes').upload(path, blob, { contentType:tipo, upsert:true });
    if(error) throw new Error(error.message);
    return { nombre:file.name, tipo, path, origen:'Equipo' };
  }
  // Modo local (sin nube): base64 como antes
  const du = await new Promise(r=>{ const rd=new FileReader(); rd.onload=()=>r(rd.result); rd.readAsDataURL(file); });
  let dataUrl=du, tipo=file.type;
  if(esImagen){ try{ dataUrl=await shrinkImageDataUrl(du,1800); tipo='image/jpeg'; }catch(_){} }
  return { nombre:file.name, tipo, dataUrl, origen:'Equipo' };
}
// Devuelve una URL temporal firmada para ver/descargar el informe guardado en Storage
async function urlInforme(rec){
  if(!rec) return null;
  if(rec.dataUrl) return rec.dataUrl;
  const sb = window.PSICO_SB;
  if(sb && rec.path){ try{ const { data } = await sb.storage.from('informes').createSignedUrl(rec.path, 3600); return data && data.signedUrl; }catch(_){} }
  return null;
}
// Descarga el informe como dataUrl base64 (para enviárselo a la IA)
async function informeDataUrl(rec){
  if(!rec) return null;
  if(rec.dataUrl) return rec.dataUrl;
  const sb = window.PSICO_SB;
  if(sb && rec.path){ try{ const { data, error } = await sb.storage.from('informes').download(rec.path); if(error||!data) return null; return await new Promise(r=>{ const rd=new FileReader(); rd.onload=()=>r(rd.result); rd.readAsDataURL(data); }); }catch(_){} }
  return null;
}
const lsGet=(k,fb)=>{ try{ const v=localStorage.getItem(k); return v!=null?JSON.parse(v):fb; }catch(e){ return fb; } };
const lsSet=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
const PTA_KEY = 'psico_pta_v1';
function ptaLoad(){ try{ return JSON.parse(localStorage.getItem(PTA_KEY)||'{}'); }catch(e){ return {}; } }
function ptaSave(d){ try{ localStorage.setItem(PTA_KEY, JSON.stringify(d)); }catch(e){} window.dispatchEvent(new Event('pta-change')); }
// forma: { [estId]: { [asignatura]: [ {id, tipo, desc, fecha, estado:'Pendiente'|'Realizada', origen:'equipo'|'profesor', profesor} ] } }
function usePTA(){
  const [data,setData]=useState(ptaLoad);
  useEffect(()=>{ const h=()=>setData(ptaLoad()); window.addEventListener('pta-change',h); window.addEventListener('storage',h); return ()=>{ window.removeEventListener('pta-change',h); window.removeEventListener('storage',h); }; },[]);
  const add=(estId,asig,ev)=>{ const d=ptaLoad(); d[estId]=d[estId]||{}; d[estId][asig]=d[estId][asig]||[]; d[estId][asig].push({ id:Date.now()+''+Math.random().toString(36).slice(2,6), estado:'Pendiente', ...ev }); ptaSave(d); };
  const del=(estId,asig,id)=>{ const d=ptaLoad(); if(d[estId]&&d[estId][asig]){ d[estId][asig]=d[estId][asig].filter(x=>x.id!==id); ptaSave(d);} };
  const setEstado=(estId,asig,id,estado)=>{ const d=ptaLoad(); const arr=d[estId]&&d[estId][asig]; if(arr){ const it=arr.find(x=>x.id===id); if(it){ it.estado=estado; ptaSave(d);} } };
  const countEst=(estId)=>{ const e=(data[estId]||{}); return Object.values(e).reduce((a,arr)=>a+arr.length,0); };
  return { data, add, del, setEstado, countEst };
}
function ptaTipoColor(tipo){ return { Prueba:'#B23A24', Trabajo:'#2563B8', Guía:'#2C7A6B', Disertación:'#9A6A12', Proyecto:'#7A4FB0' }[tipo] || '#6B6F92'; }

// ─── Informe médico: existe solo cuando se carga uno real (o demo seed) ───
const INF_KEY = 'psico_informe_v1';
let INF_MEM = null;
function infLoad(){ if(INF_MEM) return INF_MEM; try{ INF_MEM = JSON.parse(localStorage.getItem(INF_KEY)||'{}'); }catch(e){ INF_MEM={}; } return INF_MEM; }
function infSave(d){ INF_MEM = d; try{ localStorage.setItem(INF_KEY, JSON.stringify(d)); }catch(e){} window.dispatchEvent(new Event('inf-change')); }
function useInforme(){
  const [data,setData]=useState(infLoad);
  useEffect(()=>{ const h=()=>setData(infLoad()); window.addEventListener('inf-change',h); window.addEventListener('storage',()=>{ INF_MEM=null; setData(infLoad()); }); return ()=>{ window.removeEventListener('inf-change',h); }; },[]);
  const cargar=(estId,meta)=>{ const d={...infLoad()}; d[estId]={ fecha:new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'short',year:'numeric'}), origen:'Equipo', ...(meta||{}) }; infSave(d); };
  const quitar=(estId)=>{ const d={...infLoad()}; delete d[estId]; infSave(d); };
  return { data, cargar, quitar };
}
// Los estudiantes de demostración (seed e1..e5) traen informe cargado; los agregados manualmente, no.
function esSeedDemo(est){ if(PILOTO) return false; return /^e\d+$/.test(String((est&&est.id)||'')); }

// ─── Seguimiento NEE ─────────────────────────────────────────────
// Un estudiante entra al "caseload" NEE cuando: (B3) tiene informe o plan/revisión,
// o (C) el equipo lo activa manualmente. La carga masiva NO marca NEE a nadie.
const SEG_KEY = 'psico_seg_v1';
let SEG_MEM = null;
function segLoad(){ if(SEG_MEM) return SEG_MEM; try{ SEG_MEM = JSON.parse(localStorage.getItem(SEG_KEY)||'{}'); }catch(e){ SEG_MEM={}; } return SEG_MEM; }
function segSave(d){ SEG_MEM = d; try{ localStorage.setItem(SEG_KEY, JSON.stringify(d)); }catch(e){} window.dispatchEvent(new Event('seg-change')); }
// ¿Está en seguimiento NEE? manual (si existe) manda; si no, se deriva de informe/plan/seed.
function enSeguimiento(est, infData, revisiones, seg){
  const id=(est&&est.id)||''; seg=seg||segLoad();
  if(Object.prototype.hasOwnProperty.call(seg,id)) return !!seg[id];
  if(est&&est.sinNee) return false;
  if(infData && infData[id]) return true;
  if(revisiones && revisiones.some(r=>r.estId===id)) return true;
  if(esSeedDemo(est)) return true;
  return false;
}
function useSeguimiento(){
  const [seg,setSeg]=useState(segLoad);
  useEffect(()=>{ const h=()=>setSeg({...segLoad()}); window.addEventListener('seg-change',h); return ()=>window.removeEventListener('seg-change',h); },[]);
  const activar=(id)=>{ const d={...segLoad()}; d[id]=true; segSave(d); };
  const quitar=(id)=>{ const d={...segLoad()}; d[id]=false; segSave(d); };
  const reset=(id)=>{ const d={...segLoad()}; delete d[id]; segSave(d); };
  return { seg, activar, quitar, reset };
}

// Documento oficial imprimible del Plan de trabajo académico
function imprimirPlanAcademico(est, curso, tutor, planData){
  const esc=(s)=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const filas = asignaturasFor(curso).map(asig=>{
    const evs=(planData[asig]||[]).slice().sort((a,b)=>(a.fecha||'').localeCompare(b.fecha||''));
    const cont = evs.length ? evs.map(e=>{
      const f = e.fecha ? new Date(e.fecha+'T00:00').toLocaleDateString('es-CL',{day:'2-digit',month:'short'}) : '—';
      return `<div class="ev"><span class="tp" style="background:${ptaTipoColor(e.tipo)}">${esc(e.tipo)}</span> <b>${esc(e.desc)}</b> <span class="fe">· ${f} · ${esc(e.estado)}</span>${e.origen==='profesor'?` <span class="pr">(${esc(e.profesor||'Profesor')})</span>`:''}</div>`;
    }).join('') : '<span class="vac">Sin evaluaciones programadas.</span>';
    return `<tr><td class="asg">${esc(asig)}</td><td>${cont}</td></tr>`;
  }).join('');
  const logo = location.origin+location.pathname.replace(/[^/]*$/,'')+'logo-blanco.png';
  const html=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Plan de trabajo académico · ${esc(est.nombre)}</title>
  <style>
    @page{ size:A4; margin:30mm 14mm 16mm; }
    *{ box-sizing:border-box; } body{ font-family:'Segoe UI',Arial,sans-serif; color:#1c1c1c; font-size:10.5px; line-height:1.45; margin:0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .runhead{ position:fixed; top:0; left:0; right:0; height:24mm; background:#4FC0CB; display:flex; align-items:center; padding:0 18px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .runhead img{ height:74px; }
    .runhead .ttl{ margin-left:auto; color:#fff; font-style:italic; font-weight:800; font-size:14px; text-align:right; }
    h1{ font-size:15px; text-align:center; color:#2E8A95; margin:4px 0 14px; }
    h2{ font-size:11px; background:#4FC0CB; color:#fff; padding:5px 10px; margin:14px 0 7px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    table{ width:100%; border-collapse:collapse; }
    .idt td{ border:1px solid #b9c2d0; padding:5px 9px; } .idt td.k{ background:#eef2f8; font-weight:700; width:33%; }
    .adt th{ background:#4FC0CB; color:#fff; border:1px solid #4FC0CB; padding:6px; font-size:9.5px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .adt td{ border:1px solid #b9c2d0; padding:7px 9px; vertical-align:top; }
    .adt td.asg{ background:#eef2f8; font-weight:700; width:26%; }
    .ev{ margin-bottom:5px; line-height:1.5; } .ev:last-child{ margin-bottom:0; }
    .tp{ color:#fff; font-size:8px; font-weight:800; padding:1px 6px; border-radius:99px; text-transform:uppercase; letter-spacing:.3px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .fe{ color:#666; font-size:9px; } .pr{ color:#2E8A95; font-size:9px; font-style:italic; } .vac{ color:#999; font-style:italic; }
    .ft{ margin-top:24px; text-align:center; font-size:8.5px; color:#999; border-top:1px solid #ddd; padding-top:8px; }
    .firma{ margin-top:40px; display:flex; justify-content:space-around; } .firma div{ text-align:center; border-top:1px solid #333; padding-top:5px; width:40%; font-size:9.5px; }
  </style></head><body>
  <div class="runhead"><img src="${logo}" onerror="this.style.display='none'"><div class="ttl">Plan de trabajo académico · Colegio Mayor Peñalolén</div></div>
  <div style="height:28mm"></div>
  <h1>PLAN DE TRABAJO ACADÉMICO</h1>
  <h2>IDENTIFICACIÓN</h2>
  <table class="idt"><tbody>
    <tr><td class="k">Nombre del estudiante</td><td>${esc(est.nombre)}</td></tr>
    <tr><td class="k">Curso</td><td>${esc(curso)}</td></tr>
    <tr><td class="k">Profesor(a) Tutor(a)</td><td>${esc(tutor)}</td></tr>
    <tr><td class="k">Fecha de emisión</td><td>${new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'long',year:'numeric'})}</td></tr>
  </tbody></table>
  <h2>EVALUACIONES Y TRABAJOS POR ASIGNATURA</h2>
  <table class="adt"><thead><tr><th style="width:26%">Asignatura</th><th>Evaluación · Descripción · Fecha · Estado</th></tr></thead><tbody>${filas}</tbody></table>
  <div class="firma"><div>Profesional del equipo psicoeducativo</div><div>Profesor(a) Tutor(a)</div></div>
  <div class="ft">Documento oficial · Colegio Mayor Peñalolén · Generado por App Psicoeducativa</div>
  <script>window.onload=function(){setTimeout(function(){window.print();},400);};<\/script>
  </body></html>`;
  const w=window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); }
}

// Módulo del Equipo: elabora/consolida el Plan de trabajo académico del estudiante
function PlanTrabajoAcademico({ t, est, tutor }){
  const pta = usePTA();
  const [open,setOpen]=useState(false);
  const [addFor,setAddFor]=useState(null); // asignatura con formulario abierto
  const [form,setForm]=useState({ tipo:'Prueba', desc:'', fecha:'', profesor:'' });
  const planEst = pta.data[est.id] || {};
  const total = asignaturasFor(est.curso).reduce((a,asig)=>a+((planEst[asig]||[]).length),0);
  const guardar=(asig)=>{ if(!form.desc.trim()) return; pta.add(est.id, asig, { tipo:form.tipo, desc:form.desc.trim(), fecha:form.fecha, origen:'equipo', profesor:(form.profesor||'').trim() }); setForm({ tipo:'Prueba', desc:'', fecha:'', profesor:'' }); setAddFor(null); };
  return (
    <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, marginBottom:12, overflow:'hidden' }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:'100%', textAlign:'left', cursor:'pointer', background:'none', border:'none', padding:'14px 16px', display:'flex', alignItems:'center', gap:11 }}>
        <div style={{ width:34, height:34, borderRadius:9, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="doc" c={t.primary} s={18} /></div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12.5, fontWeight:800, color:t.ink }}>Plan de trabajo académico</div>
          <div style={{ fontSize:10.5, color:t.muted, marginTop:1 }}>Evaluaciones y trabajos por asignatura · visible para los profesores</div>
        </div>
        {total>0 && <span style={{ fontSize:10, fontWeight:800, color:t.primaryDark, background:t.soft, borderRadius:99, padding:'3px 9px' }}>{total}</span>}
        <span style={{ color:t.muted, fontSize:15, transform:open?'rotate(180deg)':'none', transition:'.2s' }}>⌄</span>
      </button>
      {open && (
        <div style={{ padding:'2px 16px 16px', borderTop:`1px solid ${t.border}` }} className="fade">
          <div style={{ background:t.soft, borderRadius:9, padding:'9px 12px', margin:'12px 0', fontSize:10.5, color:t.muted, lineHeight:1.5 }}>
            Programa aquí lo que el estudiante debe rendir en cada asignatura. Los profesores también pueden agregar las suyas desde su perfil; aquí se consolidan todas <span style={{ color:t.primary, fontWeight:700 }}>(marcadas con el nombre del profesor)</span>.
          </div>
          {asignaturasFor(est.curso).map(asig=>{
            const evs=(planEst[asig]||[]).slice().sort((a,b)=>(a.fecha||'').localeCompare(b.fecha||''));
            return (
              <div key={asig} style={{ borderBottom:`1px solid ${t.border}`, padding:'10px 0' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                  <span style={{ fontSize:12, fontWeight:800, color:t.ink }}>{asig}</span>
                  <button onClick={()=>{ setAddFor(addFor===asig?null:asig); setForm({ tipo:'Prueba', desc:'', fecha:'', profesor:'' }); }} style={{ background:addFor===asig?t.soft:'none', border:`1px solid ${t.border}`, borderRadius:8, color:t.primaryDark, fontSize:10.5, fontWeight:700, cursor:'pointer', padding:'4px 10px', flexShrink:0 }}>{addFor===asig?'Cancelar':'＋ Agregar'}</button>
                </div>
                {evs.map(e=>(
                  <div key={e.id} style={{ display:'flex', alignItems:'flex-start', gap:8, marginTop:7 }}>
                    <span style={{ background:ptaTipoColor(e.tipo), color:'#fff', fontSize:8.5, fontWeight:800, padding:'2px 7px', borderRadius:99, textTransform:'uppercase', letterSpacing:0.3, flexShrink:0, marginTop:1 }}>{e.tipo}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11.5, color:t.ink, lineHeight:1.4 }}>{e.desc}</div>
                      <div style={{ fontSize:9.5, color:t.muted, marginTop:1 }}>
                        {e.fecha ? new Date(e.fecha+'T00:00').toLocaleDateString('es-CL',{day:'2-digit',month:'short'}) : 'Sin fecha'}
                        {e.profesor && <span style={{ color:t.primary, fontWeight:700 }}> · {e.profesor}</span>}
                      </div>
                    </div>
                    <button onClick={()=>pta.setEstado(est.id,asig,e.id, e.estado==='Realizada'?'Pendiente':'Realizada')} style={{ flexShrink:0, cursor:'pointer', border:'none', borderRadius:99, padding:'2px 9px', fontSize:9, fontWeight:800, background:e.estado==='Realizada'?'#E2F3EC':'#FCEFD9', color:e.estado==='Realizada'?'#1E7A53':'#9A6A12' }}>{e.estado==='Realizada'?'✓ Realizada':'Pendiente'}</button>
                    <button onClick={()=>pta.del(est.id,asig,e.id)} title="Eliminar" style={{ flexShrink:0, background:'none', border:'none', cursor:'pointer', color:'#B23A24', fontSize:12, fontWeight:700, padding:'0 2px' }}>✕</button>
                  </div>
                ))}
                {addFor===asig && (
                  <div style={{ background:t.soft, borderRadius:9, padding:10, marginTop:8 }} className="fade">
                    <div style={{ display:'flex', gap:7, marginBottom:7, flexWrap:'wrap' }}>
                      <select value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))} style={{ padding:'7px 9px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11, background:t.card, color:t.ink, fontWeight:600 }}>{PTA_TIPOS.map(x=><option key={x}>{x}</option>)}</select>
                      <input type="date" value={form.fecha} onChange={e=>setForm(f=>({...f,fecha:e.target.value}))} style={{ flex:1, minWidth:120, padding:'7px 9px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11, background:t.card, color:t.ink }} />
                    </div>
                    <input value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="¿Qué debe rendir? (ej: Prueba unidad 2 · fracciones)" style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, outline:'none', marginBottom:7 }} />
                    <input value={form.profesor} onChange={e=>setForm(f=>({...f,profesor:e.target.value}))} placeholder="Profesor(a) o profesional responsable (opcional)" style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, outline:'none', marginBottom:8 }} />
                    <button onClick={()=>guardar(asig)} style={{ width:'100%', padding:8, background:t.primary, color:'#fff', border:'none', borderRadius:8, fontSize:11.5, fontWeight:700, cursor:'pointer' }}>Guardar en {asig}</button>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={()=>imprimirPlanAcademico(est, est.curso, tutor||'—', planEst)} style={{ width:'100%', marginTop:12, padding:11, background:t.card, color:t.ink, border:`1px solid ${t.border}`, borderRadius:11, fontSize:12.5, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}><Icon k="download" c={t.ink} s={16} />Descargar / Imprimir plan (formato colegio)</button>
        </div>
      )}
    </div>
  );
}

// ─── Helpers UI ──────────────────────────────────────────────────
function Star({ size=28, color }){ return <svg width={size} height={size} viewBox="0 0 100 100"><path d="M50 10C53 40 60 47 90 50C60 53 53 60 50 90C47 60 40 53 10 50C40 47 47 40 50 10Z" fill={color}/></svg>; }
function Logo({ size=56 }){ return <img src="logo-blanco.png" height={size} style={{ width:'auto', maxWidth:size*2.6, objectFit:'contain' }} alt="Colegio Mayor Peñalolén" onError={e=>{e.target.style.display='none';}} />; }

function Icon({ k, c='#fff', s=24 }){
  const P={ equipo:<g><circle cx="9" cy="8" r="3" stroke={c} strokeWidth="2"/><circle cx="17" cy="9" r="2.4" stroke={c} strokeWidth="2"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M15 19c0-2 1.3-3.6 3.2-4" stroke={c} strokeWidth="2" strokeLinecap="round"/></g>,
    profesor:<g><rect x="3" y="4" width="18" height="13" rx="2" stroke={c} strokeWidth="2"/><path d="M7 9h10M7 12h6" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M10 17h4l1 3H9z" fill={c}/></g>,
    apoderado:<g><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></g>,
    upload:<g><path d="M12 15V5m0 0l-4 4m4-4l4 4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 19h14" stroke={c} strokeWidth="2" strokeLinecap="round"/></g>,
    doc:<g><path d="M6 3h8l4 4v14H6z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M14 3v4h4M9 13h6M9 16h4" stroke={c} strokeWidth="2" strokeLinecap="round"/></g>,
    spark:<g><path d="M12 3l2 5.5L19.5 10 14 12l-2 5.5L10 12 4.5 10 10 8.5z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></g>,
    bell:<g><path d="M6 16v-5a6 6 0 1112 0v5l2 2H4z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M10 20a2 2 0 004 0" stroke={c} strokeWidth="2"/></g>,
    download:<g><path d="M12 4v10m0 0l-4-4m4 4l4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 19h14" stroke={c} strokeWidth="2" strokeLinecap="round"/></g>,
    check:<g><path d="M5 12l4 4L19 7" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></g>,
    print:<g><path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v6H8z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></g>,
    gestion:<g><path d="M4 19V5m0 14h16M8 16l3-4 3 2 4-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>,
    lock:<g><rect x="5" y="11" width="14" height="9" rx="2" stroke={c} strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke={c} strokeWidth="2"/></g>,
    users:<g><circle cx="9" cy="8" r="3" stroke={c} strokeWidth="2"/><circle cx="17" cy="9" r="2.4" stroke={c} strokeWidth="2"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M15 19c0-2 1.3-3.6 3.2-4" stroke={c} strokeWidth="2" strokeLinecap="round"/></g>,
    shield:<g><path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>,
    mail:<g><rect x="3" y="5" width="18" height="14" rx="2" stroke={c} strokeWidth="2"/><path d="M4 7l8 6 8-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>,
    search:<g><circle cx="11" cy="11" r="6" stroke={c} strokeWidth="2"/><path d="M20 20l-4-4" stroke={c} strokeWidth="2" strokeLinecap="round"/></g>,
    clock:<g><circle cx="12" cy="12" r="8" stroke={c} strokeWidth="2"/><path d="M12 8v4l3 2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>,
    chat:<g><path d="M4 5h16v11H9l-4 4V5z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M8 10h8M8 13h5" stroke={c} strokeWidth="2" strokeLinecap="round"/></g>,
    flag:<g><path d="M6 21V4m0 0h11l-2 4 2 4H6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>,
    salud:<g><path d="M12 20.5s-6.5-4.2-6.5-9.3A3.7 3.7 0 0112 8.2a3.7 3.7 0 016.5 3c0 5.1-6.5 9.3-6.5 9.3z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M7.5 12.2h2l1-1.8 1.6 3.2 1-1.4h1.4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></g>,
    pill:<g><rect x="3.5" y="9" width="17" height="6" rx="3" transform="rotate(-45 12 12)" stroke={c} strokeWidth="2"/><path d="M9 9l6 6" stroke={c} strokeWidth="2"/></g>,
    alert:<g><path d="M12 4l9 15H3z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v4M12 17h.01" stroke={c} strokeWidth="2" strokeLinecap="round"/></g>,
  }[k];
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none">{P}</svg>;
}

function Chip({ t, label, tone='soft' }){
  const map = { soft:{bg:t.soft,c:t.primaryDark}, ok:{bg:'#E2F3EC',c:'#1E7A53'}, warn:{bg:'#FCEFD9',c:'#9A6A12'}, alert:{bg:'#FBE6E2',c:'#B23A24'} };
  const m = map[tone]||map.soft;
  return <span style={{ background:m.bg, color:m.c, fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99 }}>{label}</span>;
}

// ─── ONBOARDING ──────────────────────────────────────────────────
function Onboarding({ t, onPick }){
  const roles=[
    { id:'equipo', title:'Equipo Psicoeducativo', desc:'Educ. diferencial, T. ocupacional y psicología' },
    { id:'profesor', title:'Profesor', desc:'Consulta la síntesis de apoyos de tus estudiantes' },
    { id:'apoderado', title:'Apoderado', desc:'Sube informes de especialistas externos' },
    { id:'salud', title:'Salud · TENS y RR.HH.', desc:'Estudiantes con medicación y protocolos de contención' },
    { id:'gestion', title:'Gestión · Rectoría y Dirección', desc:'Estado de avance por curso, ciclo y colegio' },
  ];
  return (
    <div style={{ height:'100%', background:t.headerGrad, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ maxWidth:480, width:'100%', textAlign:'center', color:'#fff' }} className="fade">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-start', gap:18, marginBottom:18, flexWrap:'nowrap' }}>
          <span style={{ flexShrink:0 }}><Logo size={200} /></span>
          <div style={{ textAlign:'left', flexShrink:0 }}>
            <div style={{ display:'inline-block', background:t.accent, color:t.ink, fontSize:12, fontWeight:800, padding:'5px 14px', borderRadius:6, letterSpacing:0.5, marginBottom:9, textTransform:'uppercase' }}>Colegio Mayor Peñalolén · 2026</div>
            <div style={{ fontFamily:t.display, fontSize:30, fontWeight:700, color:'#fff', lineHeight:1.05 }}>App Psicoeducativa</div>
          </div>
        </div>
        <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.7)', marginTop:4, marginBottom:30 }}>Sistematiza los apoyos para estudiantes con necesidades educativas especiales</div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {roles.map(r=>(
            <button key={r.id} onClick={()=>onPick(r.id)} style={{
              display:'flex', alignItems:'center', gap:15, textAlign:'left', cursor:'pointer',
              background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:t.radius, padding:'16px 18px', color:'#fff', transition:'all .2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.18)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';}}>
              <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,0.16)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k={r.id} c={t.accent} s={26} /></div>
              <div><div style={{ fontSize:16, fontWeight:700 }}>{r.title}</div><div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:3 }}>{r.desc}</div></div>
            </button>
          ))}
        </div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:24 }}>Colegio Mayor Peñalolén · 2026</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:8 }}>Elaborado por <span style={{ color:'rgba(255,255,255,0.8)', fontWeight:700 }}>✦ Rumbo</span></div>
      </div>
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────
function Login({ t, role, onLogin, onBack }){
  const names={ equipo:'Equipo Psicoeducativo', profesor:'Profesor', apoderado:'Apoderado', salud:'Salud · TENS', gestion:'Gestión' };
  const [loading,setLoading]=useState(false);
  const [recover,setRecover]=useState(false);
  const [recSent,setRecSent]=useState(false);
  const [recEmail,setRecEmail]=useState('');
  return (
    <div style={{ height:'100%', background:t.headerGrad, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ maxWidth:370, width:'100%' }} className="scale">
        <div style={{ textAlign:'center', color:'#fff', marginBottom:22 }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}><Logo size={92} /></div>
          <div style={{ display:'inline-block', background:t.accent, color:t.ink, fontSize:10.5, fontWeight:800, padding:'4px 12px', borderRadius:6, letterSpacing:0.5, marginBottom:8, textTransform:'uppercase' }}>Colegio Mayor Peñalolén · 2026</div>
          <div style={{ fontFamily:t.display, fontSize:20, fontWeight:700 }}>App Psicoeducativa</div>
          <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.7)', marginTop:5 }}>Acceso · {names[role]}</div>
        </div>
        <div style={{ background:'#fff', borderRadius:t.radius+2, padding:24, boxShadow:'0 18px 50px rgba(0,0,0,0.25)' }}>
          {['Correo electrónico','Contraseña'].map((l,i)=>(
            <div key={l} style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:t.muted, display:'block', marginBottom:5 }}>{l}</label>
              <input type={i?'password':'text'} placeholder={i?'••••••••':role+'@colegiodemo.cl'} style={{ width:'100%', padding:'11px 13px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:13, outline:'none' }} />
            </div>
          ))}
          <button onClick={()=>{setLoading(true);setTimeout(onLogin,700);}} style={{ width:'100%', padding:13, background:t.primary, color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', marginTop:4 }}>
            {loading?'Ingresando…':'Ingresar →'}
          </button>
          <div style={{ textAlign:'center', marginTop:14 }}><span onClick={()=>{setRecover(true);setRecSent(false);}} style={{ fontSize:12, color:t.primary, cursor:'pointer', fontWeight:700, textDecoration:'underline' }}>¿Olvidaste tu contraseña?</span></div>
          <div style={{ textAlign:'center', marginTop:10 }}><span onClick={onBack} style={{ fontSize:11.5, color:t.muted, cursor:'pointer', textDecoration:'underline' }}>← Volver al inicio</span></div>
        </div>
        <div style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:16 }}>Elaborado por <span style={{ color:'rgba(255,255,255,0.8)', fontWeight:700 }}>✦ Rumbo</span></div>
      </div>
      {recover && (
        <div onClick={()=>setRecover(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, zIndex:400 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:16, padding:24, maxWidth:380, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }} className="scale">
            {!recSent ? (
              <React.Fragment>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div style={{ fontSize:17, fontWeight:800, color:t.ink }}>Recuperar contraseña</div>
                  <span onClick={()=>setRecover(false)} style={{ cursor:'pointer', color:t.muted, fontSize:20 }}>✕</span>
                </div>
                <div style={{ fontSize:12.5, color:t.muted, marginBottom:16, lineHeight:1.5 }}>Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.</div>
                <label style={{ fontSize:11, fontWeight:700, color:t.muted, display:'block', marginBottom:5 }}>Correo electrónico</label>
                <input value={recEmail} onChange={e=>setRecEmail(e.target.value)} placeholder="tucorreo@colegiodemo.cl" style={{ width:'100%', padding:'11px 13px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:13, outline:'none', marginBottom:16 }} />
                <button onClick={()=>setRecSent(true)} style={{ width:'100%', padding:13, background:t.primary, color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer' }}>Enviar enlace →</button>
              </React.Fragment>
            ) : (
              <div style={{ textAlign:'center' }}>
                <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}><span style={{ width:52, height:52, borderRadius:14, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon k="mail" c={t.primary} s={26} /></span></div>
                <div style={{ fontSize:16, fontWeight:800, color:t.ink, marginBottom:8 }}>Te enviamos un correo para restablecer tu contraseña</div>
                <div style={{ fontSize:12.5, color:t.muted, marginBottom:18, lineHeight:1.5 }}>Revisa la bandeja de <b>{recEmail||'tu correo'}</b> (y la carpeta de spam) y sigue el enlace para crear una nueva clave.</div>
                <button onClick={()=>setRecover(false)} style={{ width:'100%', padding:13, background:t.primary, color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer' }}>Entendido</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────
function AppHeader({ t, role, onLogout, onSwitch, notifCount, notifs, revisiones }){
  const names={ equipo:'Equipo Psicoeducativo', profesor:'Profesor', apoderado:'Apoderado', salud:'Salud · TENS', gestion:'Gestión' };
  const [openN,setOpenN]=useState(false);
  const pend=[];
  if(role==='equipo'){
    const _gest=(n)=> (revisiones||[]).some(r=>r.estId===n.estId && (r.estado==='firmado'||r.estado==='archivado'));
    (notifs||[]).filter(n=>n.estado==='nuevo' && !_gest(n)).forEach(n=>pend.push({ ic:'doc', txt:'Informe por procesar', sub:`${n.from} · ${n.curso}` }));
    (revisiones||[]).filter(r=>r.estado==='cambios').forEach(r=>pend.push({ ic:'bell', txt:'Cambios solicitados', sub:`${r.estNombre} · ${r.planNombre}` }));
    (revisiones||[]).filter(r=>r.estado==='firmado').forEach(r=>pend.push({ ic:'check', txt:'Listo para archivar', sub:`${r.estNombre} · ${r.planNombre}` }));
  } else if(role==='apoderado'){
    (revisiones||[]).filter(r=>r.estado==='en_revision').forEach(r=>pend.push({ ic:'doc', txt:'Documento por firmar', sub:r.planFull }));
    (revisiones||[]).filter(r=>r.estado==='respondido').forEach(r=>pend.push({ ic:'bell', txt:'Respuesta del equipo', sub:r.planFull }));
  } else if(role==='gestion'){
    (revisiones||[]).filter(r=>r.estado==='firmado').forEach(r=>pend.push({ ic:'check', txt:'En ronda de firmas', sub:r.estNombre }));
  }
  return (
    <div style={{ background:t.headerGrad, color:'#fff', padding:'40px 18px 16px', position:'relative', flexShrink:0 }}>
      <div style={{ position:'absolute', top:32, right:14, display:'flex', gap:8 }}>
        {onSwitch && <button onClick={onSwitch} title="Cambiar de perfil (modo evaluación)" style={{ background:t.accent, border:'none', color:t.ink, borderRadius:9, padding:'6px 13px', fontSize:11.5, cursor:'pointer', fontWeight:800 }}>Cambiar perfil</button>}
        <button onClick={onLogout} style={{ background:'rgba(255,255,255,0.14)', border:'none', color:'rgba(255,255,255,0.9)', borderRadius:9, padding:'6px 13px', fontSize:11.5, cursor:'pointer', fontWeight:600 }}>Salir</button>
      </div>
      <div style={{ maxWidth:760, margin:'0 auto', display:'flex', alignItems:'center', gap:18 }}>
        <Logo size={128} />
        <div>
          <div style={{ display:'inline-block', background:t.accent, color:t.ink, fontSize:10, fontWeight:800, padding:'3px 11px', borderRadius:5, letterSpacing:0.4, marginBottom:6, textTransform:'uppercase' }}>Colegio Mayor Peñalolén · 2026</div>
          <div style={{ fontFamily:t.display, fontSize:19, fontWeight:700 }}>App Psicoeducativa</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.65)', marginTop:1 }}>{names[role]}</div>
        </div>
        <div style={{ marginLeft:'auto', marginRight:54, position:'relative' }}>
          <button onClick={()=>setOpenN(o=>!o)} style={{ position:'relative', background:'rgba(255,255,255,0.16)', border:'none', borderRadius:'50%', width:40, height:40, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon k="bell" c="#fff" s={20} />
            {pend.length>0 && <span style={{ position:'absolute', top:-3, right:-3, minWidth:18, height:18, padding:'0 4px', borderRadius:99, background:t.accent, color:t.ink, fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff' }}>{pend.length}</span>}
          </button>
          {openN && (
            <div style={{ position:'absolute', top:48, right:0, width:280, maxWidth:'80vw', background:t.card, borderRadius:14, boxShadow:'0 14px 44px rgba(0,0,0,0.3)', border:`1px solid ${t.border}`, zIndex:80, overflow:'hidden' }} className="scale">
              <div style={{ padding:'12px 15px', borderBottom:`1px solid ${t.border}`, fontSize:12.5, fontWeight:800, color:t.ink }}>Pendientes {pend.length>0?`· ${pend.length}`:''}</div>
              {pend.length===0 ? (
                <div style={{ padding:'22px 15px', textAlign:'center', color:t.muted, fontSize:12 }}>Todo al día ✓</div>
              ) : pend.slice(0,8).map((p,i)=>(
                <div key={i} style={{ display:'flex', gap:10, padding:'11px 15px', borderTop:i>0?`1px solid ${t.border}`:'none', alignItems:'center' }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k={p.ic} c={t.primary} s={16} /></div>
                  <div style={{ minWidth:0 }}><div style={{ fontSize:12, fontWeight:700, color:t.ink }}>{p.txt}</div><div style={{ fontSize:10.5, color:t.muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.sub}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toast({ t, msg }){ if(!msg) return null; return <div style={{ position:'fixed', bottom:22, left:'50%', transform:'translateX(-50%)', background:t.ink, color:'#fff', padding:'11px 20px', borderRadius:12, fontSize:12.5, fontWeight:600, zIndex:120, boxShadow:'0 8px 30px rgba(0,0,0,0.3)' }} className="fade">{msg}</div>; }

// ════════════════ EQUIPO ════════════════════════════════════════
const CURSO_GRID = {
  niveles:['1°','2°','3°','4°','5°','6°','7°','8°','I°','II°','III°','IV°'],
  letras:['A','B','C','D','E'],
};
// nº de estudiantes con NEE por curso (demo)
const NEE_POR_CURSO = { '3°A':1, '5°B':2, '7°A':1, 'I°A':1 };
// trayectoria del estudiante a través de los años (demo)
const TRAYECTORIA = PILOTO ? {} : {
  e1:[ {a:'2023',t:'Ingreso al programa',d:'Derivación por sospecha TEA',k:'doc'},{a:'2024',t:'Diagnóstico TEA',d:'Informe neurología confirma TEA nivel 1',k:'diag'},{a:'2024',t:'Primer PACI',d:'Adecuaciones de acceso y currículo',k:'plan'},{a:'2025',t:'Avance significativo',d:'Mejora en autorregulación y vínculo con pares',k:'hito'},{a:'2026',t:'PACI vigente',d:'Plan renovado y firmado',k:'plan'} ],
  e2:[ {a:'2024',t:'Ingreso al programa',d:'Derivación del profesor tutor',k:'doc'},{a:'2025',t:'Diagnóstico TDAH',d:'TDAH combinado, inicio de tratamiento',k:'diag'},{a:'2025',t:'Primer PAI',d:'Apoyos de organización y tiempo',k:'plan'},{a:'2026',t:'En seguimiento',d:'Adherencia docente irregular, requiere atención',k:'alerta'} ],
  e3:[ {a:'2025',t:'Ingreso al programa',d:'Derivación por crisis de ansiedad',k:'doc'},{a:'2025',t:'Trastorno ansioso',d:'Informe psiquiatría',k:'diag'},{a:'2025',t:'Plan Salud Mental',d:'Contención y flexibilización',k:'plan'},{a:'2026',t:'Requiere revisión',d:'Plan vencido, baja adherencia',k:'alerta'} ],
  e5:[ {a:'2022',t:'Ingreso al programa',d:'Derivación temprana',k:'doc'},{a:'2023',t:'Discapacidad intelectual leve',d:'Evaluación psicopedagógica',k:'diag'},{a:'2023',t:'Primer PACI',d:'Adecuaciones curriculares',k:'plan'},{a:'2024',t:'Consolidación de logros',d:'Lectura funcional adquirida',k:'hito'},{a:'2026',t:'PACI vigente',d:'Plan al día y firmado',k:'plan'} ],
};
// señales individuales para el semáforo de alerta temprana (demo)
const ALERTAS_ESTUDIANTE = {
  e1:{ adherencia:90, diasRevision:20, diasEntrevista:25, reportes:0, planVencido:false },
  e2:{ adherencia:50, diasRevision:75, diasEntrevista:60, reportes:2, planVencido:true },
  e3:{ adherencia:33, diasRevision:95, diasEntrevista:80, reportes:3, planVencido:true },
  e5:{ adherencia:100, diasRevision:30, diasEntrevista:15, reportes:0, planVencido:false },
};
function nivelAlerta(s){
  let p=0;
  if(s.adherencia<50) p+=3; else if(s.adherencia<70) p+=2;
  if(s.planVencido) p+=2;
  if(s.diasRevision>90) p+=2; else if(s.diasRevision>60) p+=1;
  if(s.diasEntrevista>60) p+=1;
  p+=Math.min(3,s.reportes);
  return p>=5?'alto':p>=2?'medio':'bajo';
}

// ─── Carga de nómina (importación masiva) ────────────────────────
const normCurso=(c)=>String(c||'').replace(/\s*B[áa]sico|\s*Medio/i,'').replace(/\s/g,'');
// Código de vinculación por estudiante (determinista: mismo alumno → mismo código).
// El equipo lo ve en la ficha; el apoderado debe ingresarlo para vincular. 6 caracteres.
function codigoVinculacion(est){
  const base=String((est&&(est.rut||''))||'')+'|'+String((est&&est.id)||'')+'|CMPE2026';
  let h=0; for(let i=0;i<base.length;i++){ h=(h*31 + base.charCodeAt(i))>>>0; }
  const AB='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let out='';
  for(let i=0;i<6;i++){ out+=AB[h%AB.length]; h=Math.floor(h/AB.length)+ (h%7)*131; }
  return out;
}
// Curso desde un título tipo "SÉPTIMO BÁSICO A" → "7°A"
const ORD_BASE={ 'PRIMERO':'1','SEGUNDO':'2','TERCERO':'3','CUARTO':'4','QUINTO':'5','SEXTO':'6','SEPTIMO':'7','SÉPTIMO':'7','OCTAVO':'8' };
const ORD_MEDIO={ 'PRIMERO':'I','SEGUNDO':'II','TERCERO':'III','CUARTO':'IV' };
function cursoDesdeTitulo(txt){
  const u=String(txt||'').toUpperCase();
  const letra=(u.match(/\b([A-E])\b(?!.*\b[A-E]\b)/)||[])[1]||'';
  const esMedio=/MEDIO/.test(u);
  for(const pal of Object.keys(ORD_BASE)){
    if(u.includes(pal)){ const num=esMedio?ORD_MEDIO[pal]:ORD_BASE[pal]; if(num) return num+'°'+letra; }
  }
  return null;
}
// Parser tolerante para la planilla real del colegio (matriz de filas del Excel)
function parseNominaMatriz(matriz, cursoFallback){
  const filas=(matriz||[]).map(f=>(f||[]).map(c=>String(c==null?'':c).trim()));
  // curso: buscar en las primeras filas un título con nivel + letra
  let curso=null;
  for(let i=0;i<Math.min(filas.length,8);i++){ const t=filas[i].join(' '); const c=cursoDesdeTitulo(t); if(c){ curso=c; break; } }
  if(!curso && cursoFallback){ const cf=cursoDesdeTitulo(cursoFallback)||(/^\s*(1|2|3|4|5|6|7|8|I{1,3}|IV)°?\s*[A-E]\s*$/i.test(cursoFallback)?cursoFallback.replace(/\s/g,'').replace(/°?([A-E])$/i,(m,l)=>'°'+l.toUpperCase()):null); curso=cf||cursoFallback; }
  // fila de encabezados: la que menciona apellidos/nombres/rut
  let hi=filas.findIndex(f=>f.some(c=>/apellido/i.test(c)) && f.some(c=>/nombre/i.test(c)));
  if(hi<0) hi=filas.findIndex(f=>f.some(c=>/\brut\b/i.test(c)));
  if(hi<0) return [];
  const head=filas[hi].map(c=>c.toLowerCase());
  const iAp=head.findIndex(c=>/apellido/.test(c));
  const iNo=head.findIndex(c=>/nombre/.test(c));
  const iRut=head.findIndex(c=>/rut/.test(c));
  const out=[];
  for(let r=hi+1;r<filas.length;r++){
    const f=filas[r]; if(!f.length) continue;
    const linea=f.join(' ');
    if(/expulsi[oó]n|\bret\.?\b|retirad/i.test(linea)) continue;   // saltar retirados/expulsados
    const ap=iAp>=0?f[iAp]:''; const no=iNo>=0?f[iNo]:'';
    let nombre=(ap+' '+no).trim(); if(!nombre) nombre=(f[1]||'')+' '+(f[2]||'');
    nombre=nombre.trim(); if(!nombre||/^n[°º]?$/i.test(nombre)) continue;
    const rut=(iRut>=0?f[iRut]:f[3])||'';
    if(!rut && !/[a-záéíóú]/i.test(nombre)) continue;
    // "N" en la planilla = alumno NUEVO (no es NEE). La NEE se asigna después.
    const nuevo=f.slice((iRut>=0?iRut:3)+1).some(c=>/^n$/i.test(c));
    out.push({ id:'imp_'+String(curso||'x').replace(/[^0-9a-z]/gi,'')+'_'+r+'_'+Math.random().toString(36).slice(2,8), nombre, curso:curso||'—', rut, apoderado:'', email:'', diag:'—', plan:'—', nee:false, nuevo, estado:'pendiente', edad:'', prof:'', avance:0 });
  }
  return out;
}
function parseNomina(text){
  const lines=String(text||'').split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  if(!lines.length) return [];
  const first=lines[0].toLowerCase();
  const hasHeader=/nombre|curso|rut|apoderad/.test(first);
  const rows=hasHeader?lines.slice(1):lines;
  return rows.map((ln,i)=>{
    const c=ln.split(/[,;\t]/).map(s=>s.trim());
    return { id:'imp'+Date.now()+'_'+i, nombre:c[0]||'', curso:c[1]||'—', rut:c[2]||'', apoderado:c[3]||'', email:c[4]||'', diag:(c[5]||'—'), plan:'—', estado:'pendiente', edad:'', prof:'', avance:0 };
  }).filter(r=>r.nombre);
}
const NOMINA_EJEMPLO=`Nombre,Curso,RUT,Apoderado,Email apoderado
Martina Rojas Díaz,3°A,25.111.222-3,Paula Díaz,paula.diaz@correo.cl
Agustín Vera Soto,3°A,25.222.333-4,Jorge Vera,jorge.vera@correo.cl
Florencia Núñez Pino,4°B,25.333.444-5,Ana Pino,ana.pino@correo.cl
Vicente Cárcamo Luna,7°A,25.444.555-6,Rosa Luna,rosa.luna@correo.cl
Isidora Fuentes Mora,II°B,25.555.666-7,Luis Mora,luis.mora@correo.cl`;

function IntakePanel({ t, mode, onAdd, onClose }){
  const [prev,setPrev]=useState([]);        // estudiantes parseados a confirmar
  const [pegado,setPegado]=useState('');
  const [man,setMan]=useState({ nombre:'', curso:'', rut:'', diag:'', plan:'—', nee:true });
  const cargarTexto=(txt)=>{ const r=parseNomina(txt); setPrev(r); };
  const [leyendo,setLeyendo]=useState(false);
  const cargarExcel=async(file)=>{
    setLeyendo(true);
    try{
      if(!window.XLSX){ await new Promise((res,rej)=>{ const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
      const buf=await file.arrayBuffer();
      const wb=window.XLSX.read(buf,{ type:'array' });
      let filas=[];
      wb.SheetNames.forEach(name=>{
        const ws=wb.Sheets[name];
        const matriz=window.XLSX.utils.sheet_to_json(ws,{ header:1, blankrows:false, defval:'' });
        const r=parseNominaMatriz(matriz, name);
        if(r.length) filas=filas.concat(r);
      });
      if(!filas.length){ const csv=window.XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]); filas=parseNomina(csv); }
      setPrev(filas);
    }catch(err){ alert('No se pudo leer el Excel. Guárdalo como CSV o pega las filas en el recuadro.'); }
    setLeyendo(false);
  };
  const onFile=(e)=>{ const f=e.target.files&&e.target.files[0]; if(!f)return; if(/\.(xlsx|xls)$/i.test(f.name)||/sheet|excel/i.test(f.type)){ cargarExcel(f); } else { const rd=new FileReader(); rd.onload=()=>cargarTexto(rd.result); rd.readAsText(f); } e.target.value=''; };
  const bajarPlantilla=()=>{ const b=new Blob([NOMINA_EJEMPLO],{type:'text/csv'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='plantilla-nomina.csv'; a.click(); URL.revokeObjectURL(u); };

  return (
    <div style={{ background:t.card, border:`1px solid ${t.primary}`, borderRadius:t.radius, padding:16, marginBottom:14 }} className="slide">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <div style={{ fontSize:13, fontWeight:800, color:t.ink }}>{mode==='import'?'Importar nómina de estudiantes':'Agregar un estudiante'}</div>
        <button onClick={onClose} style={{ background:'none', border:'none', fontSize:16, color:t.muted, cursor:'pointer' }}>✕</button>
      </div>

      {mode==='import' ? (
        <React.Fragment>
          <div style={{ fontSize:11, color:t.muted, marginBottom:12, lineHeight:1.5 }}>Sube el archivo <b>Excel/CSV</b> con la nómina del colegio. Columnas: <b>Nombre, Curso, RUT, Apoderado, Email</b>. Se cargan todos los cursos de una vez.</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
            <label style={{ flex:'1 1 200px', cursor:'pointer', border:`1.5px dashed ${t.border}`, borderRadius:12, padding:'16px 14px', textAlign:'center', background:t.soft }}>
              <input type="file" accept=".csv,.txt,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={onFile} style={{ display:'none' }} />
              <Icon k="download" c={t.primary} s={20} />
              <div style={{ fontSize:12, fontWeight:800, color:t.ink, marginTop:6 }}>{leyendo?'Leyendo archivo…':'Seleccionar archivo Excel o CSV'}</div>
              <div style={{ fontSize:10, color:t.muted, marginTop:2 }}>o arrastra tu planilla aquí</div>
            </label>
            <div style={{ display:'flex', flexDirection:'column', gap:7, flex:'1 1 160px' }}>
              <button onClick={()=>cargarTexto(NOMINA_EJEMPLO)} style={{ padding:'10px 12px', background:t.accent, color:t.ink, border:'none', borderRadius:10, fontSize:11.5, fontWeight:700, cursor:'pointer' }}>Probar con ejemplo</button>
              <button onClick={bajarPlantilla} style={{ padding:'10px 12px', background:t.card, color:t.primaryDark, border:`1px solid ${t.border}`, borderRadius:10, fontSize:11.5, fontWeight:700, cursor:'pointer' }}>Descargar plantilla</button>
            </div>
          </div>
          <textarea value={pegado} onChange={e=>{ setPegado(e.target.value); cargarTexto(e.target.value); }} rows={3} placeholder="…o pega aquí las filas (Nombre, Curso, RUT, Apoderado, Email)" style={{ width:'100%', padding:'9px 11px', borderRadius:9, border:`1px solid ${t.border}`, fontSize:11.5, resize:'vertical', outline:'none', fontFamily:'inherit', color:t.ink, marginBottom:12 }} />
          {prev.length>0 && (
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:800, color:t.primaryDark, marginBottom:6 }}>{prev.length} estudiante{prev.length!==1?'s':''} detectado{prev.length!==1?'s':''}</div>
              <div style={{ maxHeight:150, overflowY:'auto', border:`1px solid ${t.border}`, borderRadius:9 }}>
                {prev.slice(0,40).map((e,i)=>(
                  <div key={i} style={{ display:'flex', gap:10, padding:'7px 11px', borderTop:i>0?`1px solid ${t.border}`:'none', fontSize:11.5 }}>
                    <span style={{ fontWeight:700, color:t.ink, flex:1, minWidth:0 }}>{e.nombre}</span>
                    <span style={{ color:t.muted }}>{e.curso}</span>
                  </div>
                ))}
                {prev.length>40 && <div style={{ padding:'7px 11px', borderTop:`1px solid ${t.border}`, fontSize:10.5, color:t.muted }}>…y {prev.length-40} más</div>}
              </div>
            </div>
          )}
          <button disabled={!prev.length} onClick={()=>{ onAdd(prev); }} style={{ width:'100%', padding:12, background:prev.length?t.primary:t.soft, color:prev.length?'#fff':t.muted, border:'none', borderRadius:11, fontSize:12.5, fontWeight:700, cursor:prev.length?'pointer':'default' }}>Confirmar carga de {prev.length||''} estudiante{prev.length!==1?'s':''}</button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            {[['nombre','Nombre completo','Ej: Martina Rojas'],['curso','Curso','Ej: 3°A'],['rut','RUT','Ej: 25.111.222-3'],['diag','Diagnóstico (opcional)','Ej: TDAH']].map(([k,lbl,ph])=>(
              <div key={k} style={{ gridColumn: k==='nombre'?'1 / -1':'auto' }}>
                <label style={{ fontSize:10, fontWeight:700, color:t.muted, display:'block', marginBottom:4 }}>{lbl}</label>
                <input value={man[k]} onChange={e=>setMan(m=>({...m,[k]:e.target.value}))} placeholder={ph} style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:12, outline:'none', color:t.ink }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:10, fontWeight:700, color:t.muted, display:'block', marginBottom:5 }}>¿Tiene necesidades educativas especiales (NEE)?</label>
            <div style={{ display:'flex', gap:8 }}>
              {[['si','Sí, con NEE'],['no','Sin NEE · solo plan de trabajo']].map(([v,lbl])=>{ const on=(man.nee===(v==='si')); return (
                <button key={v} onClick={()=>setMan(m=>({...m,nee:v==='si'}))} style={{ flex:1, padding:'9px 8px', borderRadius:9, border:`1.5px solid ${on?t.primary:t.border}`, background:on?t.soft:t.card, color:on?t.primaryDark:t.muted, fontSize:11, fontWeight:700, cursor:'pointer' }}>{lbl}</button>
              ); })}
            </div>
          </div>
          <button disabled={!man.nombre.trim()||!man.curso.trim()} onClick={()=>{ onAdd([{ id:'man'+Date.now(), nombre:man.nombre.trim(), curso:man.curso.trim(), rut:man.rut.trim(), diag:man.nee?(man.diag.trim()||'—'):'', plan:'—', estado:man.nee?'pendiente':'sinNee', sinNee:!man.nee, edad:'', prof:'', avance:0 }]); }} style={{ width:'100%', padding:12, background:(man.nombre.trim()&&man.curso.trim())?t.primary:t.soft, color:(man.nombre.trim()&&man.curso.trim())?'#fff':t.muted, border:'none', borderRadius:11, fontSize:12.5, fontWeight:700, cursor:(man.nombre.trim()&&man.curso.trim())?'pointer':'default' }}>Agregar estudiante</button>
        </React.Fragment>
      )}
    </div>
  );
}

function EquipoDashboard({ t, notifs, setNotifs, revisiones, enviarRevision, responderApoderado, firmarInterno }){
  const [curso,setCurso]=useState(null);   // null = grilla
  const [sel,setSel]=useState(null);        // estudiante
  const [tab,setTab]=useState('cursos');    // cursos | bandeja
  const [busca,setBusca]=useState('');
  const [toast,setToast]=useState(null);
  const [vaciarModal,setVaciarModal]=useState(false);
  const [vaciarTxt,setVaciarTxt]=useState('');
  const [extra,setExtra]=useState(()=>lsGet('psico_extra_v1',[]));      // estudiantes cargados (import + manual)
  useEffect(()=>{ lsSet('psico_extra_v1', extra); },[extra]);
  const [intake,setIntake]=useState(null);  // null | 'import' | 'manual'
  const inf=useInforme();
  const { seg }=useSeguimiento();
  const show=(m)=>{ setToast(m); setTimeout(()=>setToast(null),2600); };
  const roster=[...ESTUDIANTES,...extra];
  const agregarEst=(arr)=>{ setExtra(p=>{ const ruts=new Set(arr.map(e=>(e.rut||'').replace(/\s/g,'').toLowerCase()).filter(Boolean)); const base=p.filter(e=>!(e.rut&&ruts.has((e.rut||'').replace(/\s/g,'').toLowerCase()))); return [...base,...arr]; }); setIntake(null); show('✓ '+arr.length+' estudiante'+(arr.length!==1?'s':'')+' cargado'+(arr.length!==1?'s':'')+' a la nómina'); };
  const vaciarNomina=()=>{ setVaciarTxt(''); setVaciarModal(true); };

  if(sel) return <FichaEstudiante t={t} est={sel} onBack={()=>setSel(null)} onToast={show} toast={toast} revisiones={revisiones} enviarRevision={enviarRevision} responderApoderado={responderApoderado} firmarInterno={firmarInterno} />;
  if(curso) return <CursoEstudiantes t={t} curso={curso} extra={extra} revisiones={revisiones} onBack={()=>setCurso(null)} onSel={setSel} />;

  const estaGestionado = (n)=> (revisiones||[]).some(r=>r.estId===n.estId && (r.estado==='firmado'||r.estado==='archivado'));
  const nuevos = notifs.filter(n=>n.estado==='nuevo' && !estaGestionado(n));
  const bandeja = notifs.filter(n=>!estaGestionado(n)); // pendientes: nuevo + en proceso
  const gestionados = notifs.filter(estaGestionado);
  const neeCount={}; roster.forEach(e=>{ if(enSeguimiento(e,inf.data,revisiones,seg)){ const c=normCurso(e.curso); neeCount[c]=(neeCount[c]||0)+1; } });
  const totalNEE = roster.filter(e=>enSeguimiento(e,inf.data,revisiones,seg)).length;
  const totalMat = roster.length;
  const planesVigentes = (revisiones||[]).filter(r=>r.estado==='firmado'||r.estado==='archivado').length;
  const porEvaluar = nuevos.length;

  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'16px 16px 50px' }} className="fade">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
        {[['En seguimiento NEE', String(totalNEE), `de ${totalMat} matriculados`],['Planes vigentes',String(planesVigentes),''],['Por evaluar', String(porEvaluar),'']].map(([l,v,sub])=>(
          <div key={l} style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:'14px 16px' }}>
            <div style={{ fontFamily:t.display, fontSize:30, fontWeight:700, color:t.primary }}>{v}</div>
            <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{l}</div>
            {sub && <div style={{ fontSize:9.5, color:t.muted, marginTop:1, opacity:.8 }}>{sub}</div>}
          </div>
        ))}
      </div>

      {/* subpestañas */}
      <div style={{ display:'flex', gap:5, background:t.soft, padding:4, borderRadius:12, marginBottom:14 }}>
        {[['cursos','Cursos'],['bandeja','Bandeja'],['alertas','Alertas'],['gestionados','Gestionados']].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:'9px 6px', fontSize:12, fontWeight:700, borderRadius:9, border:'none', cursor:'pointer',
            background: tab===id?t.card:'transparent', color: tab===id?t.primary:t.muted, boxShadow: tab===id?'0 1px 4px rgba(0,0,0,0.08)':'none', transition:'all .15s', position:'relative' }}>
            {label}
            {id==='bandeja' && nuevos.length>0 && <span style={{ marginLeft:7, background:t.accent, color:t.ink, fontSize:10, fontWeight:800, padding:'1px 7px', borderRadius:99 }}>{nuevos.length}</span>}
            {id==='gestionados' && gestionados.length>0 && <span style={{ marginLeft:7, background:t.soft, color:t.primaryDark, fontSize:10, fontWeight:800, padding:'1px 7px', borderRadius:99 }}>{gestionados.length}</span>}
          </button>
        ))}
      </div>

      {tab==='bandeja' && (
        <div className="fade">
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:4 }}>Informes recibidos de apoderados</div>
          <div style={{ fontSize:11, color:t.muted, marginBottom:12 }}>Documentos pendientes de procesar. Al procesar uno, se crea o actualiza la ficha del estudiante.</div>
          {bandeja.length===0 ? (
            <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:30, textAlign:'center', color:t.muted, fontSize:12.5 }}>No hay informes pendientes. ¡Todo al día! ✓</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {Object.entries(bandeja.reduce((acc,n)=>{ (acc[n.curso]=acc[n.curso]||[]).push(n); return acc; },{}))
                .sort((a,b)=>a[0].localeCompare(b[0]))
                .map(([curso,items])=>(
                <div key={curso}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7, paddingLeft:2 }}>
                    <span style={{ fontSize:11.5, fontWeight:800, color:t.primaryDark, textTransform:'uppercase', letterSpacing:0.5 }}>Curso {curso}</span>
                    <span style={{ background:t.soft, color:t.primaryDark, fontSize:10, fontWeight:800, padding:'1px 8px', borderRadius:99 }}>{items.length}</span>
                    <div style={{ flex:1, height:1, background:t.border }} />
                  </div>
                  <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, overflow:'hidden' }}>
                    {items.map((n,i)=>(
                      <div key={n.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 15px', borderTop: i>0?`1px solid ${t.border}`:'none' }}>
                        <div style={{ width:38, height:38, borderRadius:10, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="doc" c={t.primary} s={20} /></div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12.5, fontWeight:600, color:t.ink }}>{n.doc}</div>
                          <div style={{ fontSize:10.5, color:t.muted, marginTop:1 }}>{n.from} · {n.fecha}</div>
                        </div>
                        {n.estado==='en_proceso' && <span style={{ background:'#E8F0FB', color:'#2563B8', fontSize:9.5, fontWeight:800, padding:'2px 8px', borderRadius:99, flexShrink:0 }}>En proceso</span>}
                        <button onClick={()=>{ setNotifs(p=>p.map(x=>x.id===n.id?{...x,estado:'en_proceso'}:x)); const e=roster.find(r=>r.id===n.estId); if(e) setSel(e); }}
                          style={{ background:n.estado==='en_proceso'?t.soft:t.primary, color:n.estado==='en_proceso'?t.primaryDark:'#fff', border:'none', borderRadius:9, padding:'8px 14px', fontSize:11.5, fontWeight:700, cursor:'pointer', flexShrink:0 }}>{n.estado==='en_proceso'?'Continuar →':'Procesar →'}</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab==='cursos' && (
        <div className="fade">
          {nuevos.length>0 && (
            <button onClick={()=>setTab('bandeja')} style={{ width:'100%', textAlign:'left', cursor:'pointer', background:t.accent+'18', border:`1px solid ${t.accent}66`, borderRadius:t.radius, padding:'11px 15px', marginBottom:14, display:'flex', alignItems:'center', gap:10 }}>
              <Icon k="bell" c={t.accent} s={18} />
              <span style={{ fontSize:12, fontWeight:700, color:t.ink }}>{nuevos.length} informe{nuevos.length>1?'s':''} por procesar</span>
              <span style={{ marginLeft:'auto', fontSize:11.5, fontWeight:700, color:t.primary }}>Ver bandeja →</span>
            </button>
          )}
          <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
            <button onClick={()=>setIntake(intake==='import'?null:'import')} style={{ flex:'1 1 150px', padding:'11px 12px', background:intake==='import'?t.primary:t.card, color:intake==='import'?'#fff':t.ink, border:`1px solid ${intake==='import'?t.primary:t.border}`, borderRadius:11, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><Icon k="download" c={intake==='import'?'#fff':t.primary} s={17} />Importar nómina</button>
            <button onClick={()=>setIntake(intake==='manual'?null:'manual')} style={{ flex:'1 1 150px', padding:'11px 12px', background:intake==='manual'?t.primary:t.card, color:intake==='manual'?'#fff':t.ink, border:`1px solid ${intake==='manual'?t.primary:t.border}`, borderRadius:11, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>＋ Nuevo estudiante</button>
            {extra.length>0 && <button onClick={vaciarNomina} style={{ flex:'1 1 150px', padding:'11px 12px', background:t.card, color:'#B23A24', border:`1px solid ${t.border}`, borderRadius:11, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>Vaciar nómina cargada</button>}
          </div>
          {intake && <IntakePanel t={t} mode={intake} onAdd={agregarEst} onClose={()=>setIntake(null)} />}
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:4 }}>Selecciona un curso</div>
          <div style={{ fontSize:11, color:t.muted, marginBottom:12 }}>El número indica estudiantes con NEE. Toca un curso para ver sus estudiantes.{extra.length>0 && <span style={{ color:t.primary, fontWeight:700 }}> {extra.length} cargado{extra.length!==1?'s':''} recientemente.</span>}</div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar estudiante por nombre o diagnóstico…" style={{ width:'100%', padding:'10px 13px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:12.5, outline:'none', marginBottom:12 }} />
          {busca.trim() ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {roster.filter(e=> (e.nombre+' '+e.diag+' '+e.curso).toLowerCase().includes(busca.toLowerCase())).map(e=>(
                <button key={e.id} onClick={()=>setSel(e)} style={{ textAlign:'left', cursor:'pointer', background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'12px 14px', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:11, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:t.primaryDark, fontFamily:t.display, flexShrink:0 }}>{e.nombre.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
                  <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13, fontWeight:700, color:t.ink }}>{e.nombre}</div><div style={{ fontSize:11, color:t.muted, marginTop:1 }}>{e.curso} · {e.diag}</div></div>
                </button>
              ))}
              {roster.filter(e=> (e.nombre+' '+e.diag+' '+e.curso).toLowerCase().includes(busca.toLowerCase())).length===0 && <div style={{ textAlign:'center', color:t.muted, fontSize:12, padding:20 }}>Sin resultados.</div>}
            </div>
          ) : (
          <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'14px 12px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'34px repeat(5,1fr)', gap:6, alignItems:'center' }}>
              <div></div>
              {CURSO_GRID.letras.map(l=><div key={l} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:t.muted }}>{l}</div>)}
              {CURSO_GRID.niveles.map(n=>(
                <React.Fragment key={n}>
                  <div style={{ fontSize:10, fontWeight:700, color:t.ink, textAlign:'right', paddingRight:4 }}>{n}</div>
                  {CURSO_GRID.letras.map(l=>{
                    if(l==='E' && (n==='III°'||n==='IV°')) return <div key={l}></div>;
                    const code=n+l; const nee=neeCount[code]||0;
                    return (
                      <button key={l} onClick={()=>setCurso(code)} style={{ position:'relative', height:38, borderRadius:9, cursor:'pointer', fontSize:11, fontWeight:700,
                        border:`1px solid ${nee?t.primary:t.border}`, background:nee?t.primary:t.card, color:nee?'#fff':t.muted, transition:'all .15s' }}>
                        {code}
                        {nee>0 && <span style={{ position:'absolute', top:-6, right:-6, width:18, height:18, borderRadius:'50%', background:t.accent, color:t.ink, fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${t.bg}` }}>{nee}</span>}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
          )}
        </div>
      )}
      {tab==='alertas' && (
        <div className="fade">
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:4 }}>Semáforo de alerta temprana</div>
          <div style={{ fontSize:11, color:t.muted, marginBottom:14 }}>Cruza señales individuales —adherencia docente, vigencia del plan, tiempo sin entrevista y reportes de profesores— para anticipar qué estudiantes necesitan atención.</div>
          {(()=>{ const lista=ESTUDIANTES.filter(e=>ALERTAS_ESTUDIANTE[e.id]).map(e=>({ e, s:ALERTAS_ESTUDIANTE[e.id], lvl:nivelAlerta(ALERTAS_ESTUDIANTE[e.id]) }));
            const orden={alto:0,medio:1,bajo:2}; lista.sort((a,b)=>orden[a.lvl]-orden[b.lvl]);
            const COL={ alto:{c:'#B23A24',bg:'#FBE6E2',lbl:'Riesgo alto'}, medio:{c:'#2563B8',bg:'#E8F0FB',lbl:'Atención'}, bajo:{c:'#1E7A53',bg:'#E2F3EC',lbl:'Estable'} };
            return (<React.Fragment>
              <div style={{ display:'flex', gap:8, marginBottom:14 }}>
                {['alto','medio','bajo'].map(k=>{ const n=lista.filter(x=>x.lvl===k).length; return (
                  <div key={k} style={{ flex:1, background:COL[k].bg, borderRadius:t.radius, padding:'11px 12px', textAlign:'center' }}>
                    <div style={{ fontSize:22, fontWeight:800, color:COL[k].c }}>{n}</div>
                    <div style={{ fontSize:10, color:COL[k].c, fontWeight:700 }}>{COL[k].lbl}</div>
                  </div>
                );})}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {lista.map(({e,s,lvl})=>{ const señales=[]; if(s.adherencia<70)señales.push(`Adherencia docente ${s.adherencia}%`); if(s.planVencido)señales.push('Plan vencido'); if(s.diasRevision>60)señales.push(`${s.diasRevision} días sin revisión`); if(s.diasEntrevista>60)señales.push(`${s.diasEntrevista} días sin entrevista`); if(s.reportes>0)señales.push(`${s.reportes} reporte(s) de profesores`);
                  return (
                  <button key={e.id} onClick={()=>setSel(e)} style={{ textAlign:'left', cursor:'pointer', background:t.card, border:`1px solid ${t.border}`, borderLeft:`4px solid ${COL[lvl].c}`, borderRadius:t.radius, padding:'13px 15px', display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:12, height:12, borderRadius:'50%', background:COL[lvl].c, flexShrink:0, marginTop:3 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
                        <span style={{ fontSize:13.5, fontWeight:700, color:t.ink }}>{e.nombre}</span>
                        <span style={{ flexShrink:0, fontSize:9.5, fontWeight:800, color:COL[lvl].c, background:COL[lvl].bg, padding:'2px 9px', borderRadius:99 }}>{COL[lvl].lbl}</span>
                      </div>
                      <div style={{ fontSize:10.5, color:t.muted, marginTop:1 }}>{e.curso} · {e.diag}</div>
                      {señales.length>0 && lvl!=='bajo' && <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:8 }}>{señales.map((sg,i)=><span key={i} style={{ fontSize:9.5, fontWeight:600, color:COL[lvl].c, background:COL[lvl].bg, padding:'2px 8px', borderRadius:6 }}>{sg}</span>)}</div>}
                      {lvl==='bajo' && <div style={{ fontSize:10, color:'#1E7A53', marginTop:6, fontWeight:600 }}>✓ Apoyos aplicándose con normalidad</div>}
                    </div>
                  </button>
                );})}
              </div>
              <div style={{ fontSize:9.5, color:t.muted, marginTop:12, lineHeight:1.5 }}>Las señales provienen de la información registrada en esta app (informes, planes y seguimiento). Toca un estudiante para abrir su ficha.</div>
            </React.Fragment>);
          })()}
        </div>
      )}
      {tab==='gestionados' && (
        <div className="fade">
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:4 }}>Informes ya gestionados</div>
          <div style={{ fontSize:11, color:t.muted, marginBottom:12 }}>Documentos procesados, con su ficha creada o actualizada.</div>
          {gestionados.length===0 ? (
            <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:30, textAlign:'center', color:t.muted, fontSize:12.5 }}>Aún no has procesado informes.</div>
          ) : (
            <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, overflow:'hidden' }}>
              {gestionados.map((n,i)=>(
                <div key={n.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 15px', borderTop: i>0?`1px solid ${t.border}`:'none' }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:'#E2F3EC', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="check" c="#1E7A53" s={20} /></div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:600, color:t.ink }}>{n.doc}</div>
                    <div style={{ fontSize:10.5, color:t.muted, marginTop:1 }}>{n.from} · {n.curso} · {n.fecha}</div>
                  </div>
                  <Chip t={t} label="Gestionado" tone="ok" />
                </div>
              ))}
            </div>
          )}
          {(()=>{ const docs=(revisiones||[]).filter(r=>r.estado==='firmado'||r.estado==='archivado'); if(docs.length===0) return null; return (
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:4 }}>Documentos con firmas</div>
              <div style={{ fontSize:11, color:t.muted, marginBottom:12 }}>Planes en ronda de firmas o ya archivados.</div>
              <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, overflow:'hidden' }}>
                {docs.map((r,i)=>{ const arch=r.estado==='archivado'; return (
                  <div key={r.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 15px', borderTop:i>0?`1px solid ${t.border}`:'none' }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:arch?'#E2F3EC':'#E8F0FB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k={arch?'check':'doc'} c={arch?'#1E7A53':'#2563B8'} s={19} /></div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{r.planFull} · {r.estNombre}</div>
                      <div style={{ fontSize:10.5, color:t.muted, marginTop:1 }}>{r.curso} · {arch?('Archivado · Folio '+(r.folio||'')):'Firmas completas, listo para archivar'}</div>
                    </div>
                    <span style={{ flexShrink:0, fontSize:9.5, fontWeight:800, color:arch?'#1E7A53':'#2563B8', background:arch?'#E2F3EC':'#E8F0FB', padding:'2px 9px', borderRadius:99 }}>{arch?'Archivado':'Firmado'}</span>
                  </div>
                );})}
              </div>
            </div>
          ); })()}
        </div>
      )}
      <Toast t={t} msg={toast} />
      {vaciarModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(20,30,26,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:400, padding:20 }} onClick={()=>setVaciarModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:16, maxWidth:420, width:'100%', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }} className="scale">
            <div style={{ background:'#B23A24', color:'#fff', padding:'14px 18px', display:'flex', alignItems:'center', gap:10, fontSize:15, fontWeight:800 }}><span style={{ fontSize:18 }}>⚠️</span>¡CUIDADO!</div>
            <div style={{ padding:'18px 18px 20px' }}>
              <div style={{ fontSize:12.5, color:t.ink, lineHeight:1.5, marginBottom:14 }}>Esta acción borra <b>TODA la nómina cargada</b> (los datos de demostración se mantienen). Para confirmar, escribe la palabra <b>BORRAR</b>:</div>
              <input autoFocus value={vaciarTxt} onChange={e=>setVaciarTxt(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && vaciarTxt.trim().toUpperCase()==='BORRAR'){ setExtra([]); setVaciarModal(false); show('Nómina cargada vaciada'); } }} placeholder="BORRAR" style={{ width:'100%', padding:'11px 13px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:14, fontWeight:700, letterSpacing:1, outline:'none', textAlign:'center', color:t.ink }} />
              <div style={{ display:'flex', gap:9, marginTop:16 }}>
                <button onClick={()=>setVaciarModal(false)} style={{ flex:1, padding:11, background:t.soft, color:t.muted, border:'none', borderRadius:11, fontSize:12.5, fontWeight:700, cursor:'pointer' }}>Cancelar</button>
                <button disabled={vaciarTxt.trim().toUpperCase()!=='BORRAR'} onClick={()=>{ setExtra([]); setVaciarModal(false); show('Nómina cargada vaciada'); }} style={{ flex:1.3, padding:11, background:vaciarTxt.trim().toUpperCase()==='BORRAR'?'#B23A24':t.soft, color:vaciarTxt.trim().toUpperCase()==='BORRAR'?'#fff':t.muted, border:'none', borderRadius:11, fontSize:12.5, fontWeight:700, cursor:vaciarTxt.trim().toUpperCase()==='BORRAR'?'pointer':'default' }}>Vaciar nómina</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hoja imprimible de códigos de vinculación por curso (para el equipo)
function imprimirCodigosCurso(curso, lista){
  const esc=(s)=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const logo = location.origin+location.pathname.replace(/[^/]*$/,'')+'logo-blanco.png';
  const filas=lista.map((e,i)=>`<tr><td style="text-align:center;color:#888">${i+1}</td><td><b>${esc(e.nombre)}</b></td><td style="text-align:center">${esc(e.rut||'—')}</td><td style="text-align:center;font-family:monospace;font-size:15px;font-weight:800;letter-spacing:2px">${codigoVinculacion(e)}</td></tr>`).join('');
  const html=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Códigos de vinculación · Curso ${esc(curso)}</title>
  <style>@page{size:A4;margin:18mm 16mm} *{box-sizing:border-box} body{font-family:'Segoe UI',Arial,sans-serif;color:#1a2b25;margin:0}
  .head{display:flex;align-items:center;gap:14px;background:#2C7A6B;color:#fff;padding:14px 18px;border-radius:10px}
  .head img{height:44px} .head h1{font-size:16px;margin:0;font-weight:800} .head p{margin:2px 0 0;font-size:11px;opacity:.9}
  .nota{background:#F0F6F4;border:1px solid #cfe3dd;border-radius:8px;padding:10px 13px;font-size:10.5px;color:#40554e;margin:14px 0;line-height:1.5}
  table{width:100%;border-collapse:collapse;font-size:11.5px} th{background:#EAF2EF;color:#2C7A6B;text-align:left;padding:8px 10px;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
  td{padding:8px 10px;border-bottom:1px solid #e6ebe9} .ft{margin-top:20px;text-align:center;font-size:8.5px;color:#999;border-top:1px solid #ddd;padding-top:7px}
  @media print{.noprint{display:none}}</style></head><body>
  <div class="head"><img src="${logo}" onerror="this.style.display='none'"><div><h1>Códigos de vinculación · Curso ${esc(curso)}</h1><p>Colegio Mayor Peñalolén · App Psicoeducativa</p></div></div>
  <div class="nota"><b>Uso interno del equipo.</b> Entregue a cada apoderado el código de su estudiante. Junto con el RUT, es lo que necesita para vincularse en la app y ver <b>solo</b> la información de su hijo/a. No difundir la lista completa.</div>
  <table><thead><tr><th style="width:28px;text-align:center">#</th><th>Estudiante</th><th style="text-align:center">RUT</th><th style="text-align:center">Código</th></tr></thead><tbody>${filas}</tbody></table>
  <div class="ft">Generado el ${new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'long',year:'numeric'})} · ${lista.length} estudiante(s) · Documento confidencial</div>
  <div class="noprint" style="text-align:center;margin-top:18px"><button onclick="window.print()" style="background:#2C7A6B;color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer">Imprimir / Guardar PDF</button></div>
  </body></html>`;
  const w=window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); }
}

// ─── ESTUDIANTES DE UN CURSO ─────────────────────────────────────
function CursoEstudiantes({ t, curso, extra, revisiones, onBack, onSel }){
  const norm=(c)=>c.replace(/\s*B[áa]sico|\s*Medio/i,'').replace(/\s/g,'');
  const inf=useInforme(); const { seg }=useSeguimiento();
  const lista=[...ESTUDIANTES,...(extra||[])].filter(e=>norm(e.curso)===curso);
  const enSeg=lista.filter(e=>enSeguimiento(e,inf.data,revisiones,seg)).length;
  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'14px 16px 50px' }} className="fade">
      <button onClick={onBack} style={{ background:'none', border:'none', color:t.muted, fontSize:12.5, cursor:'pointer', marginBottom:12, fontWeight:600 }}>← Volver a la grilla de cursos</button>
      <div style={{ fontFamily:t.display, fontSize:22, fontWeight:700, color:t.ink, marginBottom:3 }}>Curso {curso}</div>
      <div style={{ fontSize:12, color:t.muted, marginBottom:16 }}>{lista.length} estudiante{lista.length!==1?'s':''} en la nómina · <b style={{ color:t.primary }}>{enSeg}</b> en seguimiento NEE</div>
      {lista.length>0 && (
        <button onClick={()=>imprimirCodigosCurso(curso, lista)} style={{ background:t.soft, color:t.primaryDark, border:`1px solid ${t.border}`, borderRadius:10, padding:'9px 14px', fontSize:12, fontWeight:700, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:7, marginBottom:14 }}><Icon k="doc" c={t.primary} s={16} />Lista de códigos de vinculación (imprimir / PDF)</button>
      )}
      {lista.length===0 ? (
        <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:30, textAlign:'center', color:t.muted, fontSize:12.5 }}>Este curso no tiene estudiantes en la nómina todavía.</div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {lista.map(e=>{ const seguido=enSeguimiento(e,inf.data,revisiones,seg); return (
            <button key={e.id} onClick={()=>onSel(e)} style={{ textAlign:'left', cursor:'pointer', background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'13px 15px', display:'flex', alignItems:'center', gap:13, transition:'all .15s' }}
              onMouseEnter={ev=>ev.currentTarget.style.borderColor=t.primary} onMouseLeave={ev=>ev.currentTarget.style.borderColor=t.border}>
              <div style={{ width:42, height:42, borderRadius:12, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:700, color:t.primaryDark, fontFamily:t.display }}>{e.nombre.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
              <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13.5, fontWeight:700, color:t.ink }}>{e.nombre}{e.nuevo && <span style={{ marginLeft:7, fontSize:9.5, fontWeight:800, color:t.primaryDark, background:t.soft, padding:'1px 7px', borderRadius:99 }}>NUEVO</span>}</div><div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{!seguido?'Directorio · sin seguimiento':(e.diag&&e.diag!=='—'?e.diag:'En seguimiento NEE')}</div></div>
              {!seguido && <Chip t={t} label="Directorio" tone="soft" />}
              {seguido && e.estado==='vigente' && <Chip t={t} label={e.plan+' gestionado'} tone="ok" />}
              {seguido && e.estado==='borrador' && <Chip t={t} label="En elaboración" tone="warn" />}
              {seguido && (e.estado==='pendiente'||!e.estado) && <Chip t={t} label="En seguimiento" tone="alert" />}
            </button>
          ); })}
        </div>
      )}
    </div>
  );
}

// categorías de documento (propósito) — para diferenciarlos en la ficha
const DOC_CATS = {
  informe:{ label:'Documento de origen', icon:'doc', color:'#6B6F92' },
  PAI:{ label:'Acompañamiento', icon:'check', color:'#2C7A6B' },
  PACI:{ label:'Adecuación curricular', icon:'doc', color:'#185FA5' },
  PAEC:{ label:'Adecuación evaluativa', icon:'check', color:'#C2841E' },
  PSM:{ label:'Salud mental', icon:'spark', color:'#7A4FB0' },
};

// ─── FICHA ESTUDIANTE (con autocompletado IA) ────────────────────
function FichaEstudiante({ t, est, onBack, onToast, toast, revisiones, enviarRevision, responderApoderado, firmarInterno }){
  const [firmandoIdx,setFirmandoIdx]=useState(null);
  const [mostrarResp,setMostrarResp]=useState(false);
  const [respTxt,setRespTxt]=useState('Los cambios que solicita requieren una entrevista presencial con el equipo psicoeducativo. Por favor contáctese al correo psicoeducativo@cmpe.cl, indicando en el asunto el curso y nombre del estudiante.');
  const revExist=(revisiones||[]).find(r=>r.estId===est.id && ['en_revision','cambios','firmado','archivado'].includes(r.estado)) || (revisiones||[]).find(r=>r.estId===est.id);
  const [planId,setPlanId]=useState(revExist?revExist.planId:(est.plan==='—'?'PAI':(est.plan==='Plan Salud Mental'?'PSM':est.plan)));
  const [phase,setPhase]=useState(revExist?'listo':(est.estado==='pendiente'?'inicio':'listo')); // inicio | generando | listo
  const [modo,setModo]=useState(revExist?(revExist.modo||'ia'):(est.estado==='pendiente'?null:'ia')); // ia | manual
  const [marcadas,setMarcadas]=useState(()=> revExist&&revExist.marcadas?revExist.marcadas:(est.estado==='pendiente'?{}:seedMarcas()));
  const [resp,setResp]=useState(()=>{ const ex=(revisiones||[]).find(r=>r.estId===est.id && r.resp && Object.keys(r.resp).length); return (ex&&ex.resp)||{}; });
  const [director,setDirector]=useState(()=>{ const d=lsGet('psico_datos_v1',{})[est.id]; return (d&&d.director)||''; });
  const [datos,setDatos]=useState(()=>{ const d=lsGet('psico_datos_v1',{})[est.id]||{}; return { nacimiento:d.nacimiento||'', edad:d.edad||est.edad||'', diag:d.diag||est.diag||'' }; });
  useEffect(()=>{ const all=lsGet('psico_datos_v1',{}); all[est.id]={ ...datos, director }; lsSet('psico_datos_v1',all); },[datos,director,est.id]);
  const [obs,setObs]=useState(()=>{ const ex=(revisiones||[]).find(r=>r.estId===est.id && r.obs); return (ex&&ex.obs)||''; });
  const EQUIPO_ROLES=['Profesor/a Tutor/a','Psicólogo/a','Educador/a Diferencial','Terapeuta Ocupacional','Psicólogo/a de Convivencia'];
  const [equipo,setEquipo]=useState(()=>({'Profesor/a Tutor/a':true,'Educador/a Diferencial':true}));
  const toggleEquipo=(r)=> setEquipo(p=>({...p,[r]:!p[r]}));
  const toggleResp=(k)=> setResp(p=>({...p,[k]:!p[k]}));
  const FIRMANTES_ROLES=['Profesor(a) Tutor(a)','Educador(a) Diferencial','Psicóloga','Terapeuta Ocupacional','Director(a) de Ciclo'];
  const [firmantesSel,setFirmantesSel]=useState(()=>{
    const ex=(revisiones||[]).find(r=>r.estId===est.id && r.planId===planId);
    if(ex && ex.firmantes && ex.firmantes.length) return Object.fromEntries(FIRMANTES_ROLES.map(r=>[r, ex.firmantes.includes(r)]));
    return Object.fromEntries(FIRMANTES_ROLES.map(r=>[r,true]));
  });
  const toggleFirmante=(r)=> setFirmantesSel(p=>({...p,[r]:!p[r]}));
  const [verInforme,setVerInforme]=useState(false);
  const inf=useInforme();
  const { seg, activar:segActivar, quitar:segQuitar }=useSeguimiento();
  const seguido=enSeguimiento(est,inf.data,revisiones,seg);
  const seguidoManual=Object.prototype.hasOwnProperty.call(seg,est.id);
  const tieneInforme = esSeedDemo(est) || !!(inf.data[est.id] && (inf.data[est.id].dataUrl || inf.data[est.id].path));
  const [iaSintesis,setIaSintesis]=useState(null);
  const esNEE = !est.sinNee;
  const [tab,setTab]=useState(esNEE?'resumen':'academico');
  const TABS = esNEE ? [['resumen','Resumen'],['documentos','Documentos'],['academico','Plan académico'],['nee','Plan NEE · Firmas']] : [['academico','Plan de trabajo académico']];
  // gestión del caso — persistida por estudiante
  const [caso,setCaso]=useState(()=>{ const all=lsGet('psico_caso_v1',{}); if(all[est.id]) return all[est.id]; return { responsable:'', revision:'', entrevistas: PILOTO ? [] : [
    { fecha:'15 may 2026', nota:'Reunión inicial con apoderado. Acuerdos de apoyo en casa.' },
  ] }; });
  useEffect(()=>{ const all=lsGet('psico_caso_v1',{}); all[est.id]=caso; lsSet('psico_caso_v1',all); },[caso,est.id]);
  const [entTxt,setEntTxt]=useState('');
  const addEntrevista=()=>{ if(!entTxt.trim())return; setCaso(c=>({...c, entrevistas:[...c.entrevistas, { fecha:new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'short',year:'numeric'}), nota:entTxt.trim() }]})); setEntTxt(''); onToast('✓ Entrevista registrada'); };
  const DIAG_PLANTILLAS = {
    'TEA':[0,1,3], 'TDAH':[1,3], 'ansios':[4], 'intelectual':[0,2], 'def':[0,2] };
  const aplicarPlantilla=()=>{
    const key=Object.keys(DIAG_PLANTILLAS).find(k=> ((datos.diag||est.diag)||'').toLowerCase().includes(k.toLowerCase())) || 'def';
    const grupos=DIAG_PLANTILLAS[key]; const m={};
    (planId==='PAEC'?ADEC_EVAL:planId==='PSM'?ADEC_PSM:ADEC_ACCESO).forEach((g,gi)=>{ if(grupos.includes(gi)) g.items.forEach((it,ii)=>{ if(ii%2===0) m[gi+'-'+ii]=true; }); });
    setMarcadas(m); setPhase('listo'); setModo('manual'); onToast('Plantilla aplicada según diagnóstico');
  };
  const plan=PLANES.find(p=>p.id===planId);
  const revDe = (pid)=> (revisiones||[]).find(r=>r.estId===est.id && r.planId===pid);
  const estadoDePlan = (pid)=>{ const rv=revDe(pid); if(!rv) return 'No iniciado'; return { en_revision:'En revisión', cambios:'Cambios solicitados', respondido:'Respondido', firmado:'Firmado', archivado:'Finalizado' }[rv.estado] || 'En elaboración'; };
  const cambiarPlan = (pid)=>{ setPlanId(pid); const rv=revDe(pid); if(rv){ setPhase('listo'); setModo(rv.modo||'ia'); setMarcadas(rv.marcadas||{}); setObs(rv.obs||''); } else { setPhase('inicio'); setModo(null); setMarcadas({}); setObs(''); } };
  const adecSet = planId==='PAEC' ? ADEC_EVAL : planId==='PSM' ? ADEC_PSM : ADEC_ACCESO;
  // Publica el estudiante abierto para que el Copiloto IA tenga contexto
  useEffect(()=>{
    const _rec = inf.data[est.id] || null;
    window.__psicoStudentCtx = { estId:est.id, nombre:est.nombre, curso:est.curso, diag:est.diag||'', plan:(plan&&plan.full)||'', planNombre:(plan&&plan.nombre)||'', resumen:(iaSintesis&&iaSintesis.resumen)||'', adec:(adecSet||[]).map(g=>({ tipo:g.tipo, items:g.items })), informe:(esSeedDemo(est)||_rec)?{ nombre:(_rec&&_rec.nombre)||'Informe médico', tieneArchivo:!!(_rec&&(_rec.dataUrl||_rec.path)), rec:_rec, demo:esSeedDemo(est) }:null };
    window.dispatchEvent(new Event('psico-student'));
    return ()=>{ window.__psicoStudentCtx=null; window.dispatchEvent(new Event('psico-student')); };
  }, [est.id, planId, iaSintesis, inf.data]);

  function seedMarcas(){ const m={}; (planId==='PAEC'?ADEC_EVAL:planId==='PSM'?ADEC_PSM:ADEC_ACCESO).forEach((g,gi)=>g.items.forEach((it,ii)=>{ if((gi+ii)%2===0) m[gi+'-'+ii]=true; })); return m; }

  const generar=async()=>{
    const rec = inf.data[est.id];
    const seed = esSeedDemo(est);
    if(!seed && !(rec && (rec.dataUrl || rec.path))){ onToast('Primero carga el informe del especialista'); return; }
    setPhase('generando'); setModo('ia');
    const set = planId==='PAEC' ? ADEC_EVAL : planId==='PSM' ? ADEC_PSM : ADEC_ACCESO;
    const cat = set.map((g,gi)=>`Grupo ${gi} — ${g.tipo}:\n`+g.items.map((it,ii)=>`  ${gi}-${ii}: ${it}`).join('\n')).join('\n');
    const instrucc=`Eres un especialista en educación diferencial (Chile). Debes pre-rellenar un ${plan.full} (${plan.nombre}) para ${est.nombre} (${est.edad||'edad no indicada'}, curso ${est.curso}, diagnóstico ${est.diag||'no indicado'}) a partir EXCLUSIVAMENTE del informe del especialista.\n\nReglas estrictas:\n- Marca SOLO las adecuaciones que el informe respalde de forma explícita o claramente implícita.\n- Si el informe no menciona algo, NO lo marques.\n- El resumen y los objetivos deben basarse ÚNICAMENTE en lo que dice el informe. No inventes datos clínicos ni apoyos que el informe no mencione.\n- Si el informe es ilegible o no aporta información suficiente, devuelve "marcar":[] y explica en "resumen" que el informe no permite determinar las adecuaciones.\n\nLista de adecuaciones posibles (usa las claves gi-ii):\n${cat}\n\nResponde ÚNICAMENTE un JSON válido, sin texto adicional:\n{"resumen":"2-3 frases basadas en el informe","marcar":["gi-ii", ...],"objetivos":["objetivo 1","objetivo 2","objetivo 3"]}`;
    let content;
    const _du = (rec && (rec.dataUrl || rec.path)) ? await informeDataUrl(rec) : null;
    if(_du){
      let du = _du;
      if(/^data:image\//.test(du)){ du = await shrinkImageDataUrl(du, 1568); }
      const mm = /^data:([^;]+);base64,(.*)$/.exec(du);
      const blocks = [{ type:'text', text: instrucc + '\n\nEl informe del especialista está adjunto a continuación. Léelo con atención:' }];
      if(mm){ const media=mm[1], b64=mm[2];
        if(/^image\//.test(media)) blocks.push({ type:'image', source:{ type:'base64', media_type:media, data:b64 } });
        else if(media==='application/pdf') blocks.push({ type:'document', source:{ type:'base64', media_type:'application/pdf', data:b64 } });
      }
      content = blocks;
    } else {
      content = instrucc + `\n\nINFORME (demostración): informe de neurología que recomienda apoyos acordes al diagnóstico ${datos.diag||est.diag}.`;
    }
    try{
      const r=await window.claude.complete({ messages:[{ role:'user', content }], max_tokens:1500 });
      const txt=(r||'').replace(/```json|```/g,'').trim();
      const ini=txt.indexOf('{'), fin=txt.lastIndexOf('}');
      const data=JSON.parse(txt.slice(ini,fin+1));
      const m={}; (data.marcar||[]).forEach(k=>{ if(/^\d+-\d+$/.test(k)) m[k]=true; });
      setMarcadas(m);
      setIaSintesis({ resumen:data.resumen||'', objetivos:Array.isArray(data.objetivos)?data.objetivos:[] });
      if(data.resumen && !obs) setObs('Síntesis IA: '+data.resumen);
      setPhase('listo');
      onToast(Object.keys(m).length?'Plan pre-rellenado desde el informe':'La IA no encontró adecuaciones respaldadas por el informe');
    }catch(e){
      const msg=String(e&&e.message||e); console.warn('IA informe:', msg);
      const amable = /429|rate|limit|too many|satur/i.test(msg) ? 'La IA está recibiendo muchas peticiones. Espera 1 minuto y vuelve a intentarlo.'
        : /process image|image|media|format|decode/i.test(msg) ? 'No se pudo procesar la imagen. Prueba con una foto más nítida, sin cortes, o súbela en PDF.'
        : 'No se pudo leer el informe automáticamente. Revísalo o complétalo manualmente.';
      setMarcadas({}); setIaSintesis(null); setPhase('listo'); onToast(amable);
    }
  };
  const manual=()=>{ setModo('manual'); setMarcadas({}); setPhase('listo'); onToast('Planilla en blanco · formato del colegio'); };
  const toggle=(k)=> setMarcadas(p=>({...p,[k]:!p[k]}));
  const descargarPlan=(p)=>{
    const set = p.id==='PAEC'?ADEC_EVAL:p.id==='PSM'?ADEC_PSM:ADEC_ACCESO;
    const r=(revisiones||[]).find(x=>x.estId===est.id && x.planId===p.id);
    const mk = p.id===planId ? marcadas : (r&&r.marcadas) ? r.marcadas : {};
    imprimirOficial(p, est, mk, set, '17 jun 2026', p.id===planId?resp:((r&&r.resp)||{}), p.id===planId?director:((r&&r.director)||''), p.id===planId?equipo:((r&&r.equipo)||{}), p.id===planId?(obs||(r&&r.obs)||''):((r&&r.obs)||''), r);
    onToast('Descargando '+p.nombre);
  };

  // estado de revisión del documento actual (este estudiante + plan)
  const rev = (revisiones||[]).find(r => r.estId===est.id && r.planId===planId);
  const revEstado = rev ? rev.estado : 'borrador'; // borrador | en_revision | cambios | firmado
  const REV_INFO = {
    borrador:   { label:'Borrador', color:t.muted, bg:t.soft },
    en_revision:{ label:'En revisión del apoderado', color:'#9A6A12', bg:'#FCEFD9' },
    cambios:    { label:'Cambios solicitados', color:'#B23A24', bg:'#FBE6E2' },
    firmado:    { label:'Aprobado y firmado', color:'#1E7A53', bg:'#E2F3EC' },
  }[revEstado];

  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'14px 16px 50px' }} className="fade">
      <button onClick={onBack} style={{ background:'none', border:'none', color:t.muted, fontSize:12.5, cursor:'pointer', marginBottom:12, fontWeight:600 }}>← Volver</button>

      {/* identificación */}
      <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:16, marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:13 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:t.primaryDark, fontFamily:t.display, fontSize:18 }}>{est.nombre.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:t.display, fontSize:19, fontWeight:600, color:t.ink }}>{est.nombre}</div>
            <div style={{ fontSize:11.5, color:t.muted, marginTop:2 }}>{est.curso}{est.rut?` · ${est.rut}`:''}{esNEE && (datos.diag||datos.edad)?` · ${[datos.edad,datos.diag].filter(Boolean).join(' · ')}`:''}</div>
          </div>
          {esNEE && (tieneInforme
            ? <button onClick={()=>setVerInforme(true)} style={{ flexShrink:0, background:t.soft, color:t.primaryDark, border:'none', borderRadius:9, padding:'8px 13px', fontSize:11.5, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}><Icon k="doc" c={t.primary} s={16} />Ver informe médico</button>
            : <div title="Aún no hay informe médico cargado" style={{ flexShrink:0, background:'transparent', color:t.muted, border:`1px dashed ${t.border}`, borderRadius:9, padding:'8px 13px', fontSize:11.5, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}><Icon k="doc" c={t.muted} s={16} />Sin informe médico</div>)}
        </div>
      </div>

      {/* código de vinculación para el apoderado */}
      <div style={{ background:t.soft, border:`1px dashed ${t.primary}`, borderRadius:t.radius, padding:'11px 14px', marginBottom:12, display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:11, fontWeight:800, color:t.primaryDark }}>Código de vinculación del apoderado</div>
          <div style={{ fontSize:10, color:t.muted, marginTop:2, lineHeight:1.4 }}>Entrégalo al apoderado. Lo necesita (junto al RUT) para vincularse con {est.nombre.split(' ')[0]} y ver solo su información.</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          <span style={{ fontFamily:'monospace', fontSize:20, fontWeight:800, letterSpacing:3, color:t.ink }}>{codigoVinculacion(est)}</span>
          <button onClick={()=>{ try{ navigator.clipboard.writeText(codigoVinculacion(est)); onToast('Código copiado: '+codigoVinculacion(est)); }catch(e){ onToast('Código: '+codigoVinculacion(est)); } }} title="Copiar" style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:8, padding:'6px 8px', cursor:'pointer' }}><Icon k="doc" c={t.primary} s={15} /></button>
        </div>
      </div>
      {(()=>{ const lect=lsGet('psico_lectura_v1',{}); const conf=Object.keys(lect).filter(k=>k.startsWith(est.id+'::')&&lect[k]).map(k=>({ asig:k.split('::')[1], fecha:lect[k] })); if(!conf.length) return null; return (
        <div style={{ background:'#EAF3F0', border:'1px solid #C9E3DB', borderRadius:t.radius, padding:'11px 14px', marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'#1E7A53', textTransform:'uppercase', letterSpacing:0.4, marginBottom:7 }}>Lectura docente confirmada</div>
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            {conf.map((c,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:17, height:17, borderRadius:5, background:'#D5EBE1', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="check" c="#1E7A53" s={12} /></span>
                <span style={{ fontSize:11.5, color:t.ink }}><b>{c.asig}</b> · leído y aplicado · {c.fecha}</span>
              </div>
            ))}
          </div>
        </div>
      ); })()}
      <div style={{ background:seguido?t.soft:t.card, border:`1px solid ${seguido?t.primary:t.border}`, borderRadius:t.radius, padding:'11px 14px', marginBottom:12, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:180 }}>
          <div style={{ fontSize:12, fontWeight:800, color:seguido?t.primaryDark:t.ink }}>{seguido?'En seguimiento NEE':'En el directorio (sin seguimiento NEE)'}</div>
          <div style={{ fontSize:10.5, color:t.muted, marginTop:2 }}>{seguido?(seguidoManual?'Activado manualmente por el equipo.':'Activo automáticamente por tener informe o plan.'):'Este estudiante no cuenta como caso NEE. Actívalo cuando el equipo inicie su seguimiento.'}</div>
        </div>
        {seguido
          ? <button onClick={()=>{ segQuitar(est.id); onToast('Seguimiento NEE desactivado'); }} style={{ flexShrink:0, background:'transparent', color:t.muted, border:`1px solid ${t.border}`, borderRadius:9, padding:'8px 13px', fontSize:11.5, fontWeight:700, cursor:'pointer' }}>Quitar seguimiento</button>
          : <button onClick={()=>{ segActivar(est.id); onToast('✓ Estudiante en seguimiento NEE'); }} style={{ flexShrink:0, background:t.primary, color:'#fff', border:'none', borderRadius:9, padding:'8px 13px', fontSize:11.5, fontWeight:700, cursor:'pointer' }}>Activar seguimiento NEE</button>}
      </div>

      {/* pestañas de la ficha */}
      {TABS.length>1 && (
        <div style={{ display:'flex', gap:5, background:t.soft, padding:4, borderRadius:12, marginBottom:14, overflowX:'auto' }}>
          {TABS.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ flex:1, whiteSpace:'nowrap', padding:'8px 10px', borderRadius:9, border:'none', cursor:'pointer', fontSize:11.5, fontWeight:700, background:tab===id?t.card:'transparent', color:tab===id?t.primaryDark:t.muted, boxShadow:tab===id?'0 1px 3px rgba(0,0,0,0.08)':'none' }}>{label}</button>
          ))}
        </div>
      )}

      {tab==='resumen' && (<React.Fragment>
      {/* trayectoria del estudiante */}
      {(()=>{
        const base=(TRAYECTORIA[est.id]||[]).slice();
        const rec = inf.data[est.id];
        if(rec && (rec.dataUrl||rec.path)) base.push({ a:'2026', t:'Informe recibido', d:`${/apoderado/i.test(rec.origen||'')?'Enviado por el apoderado':'Cargado por el equipo'} · ${rec.nombre||'Informe'}${rec.fecha?' · '+rec.fecha:''}`, k:'doc' });
        const vivos=(revisiones||[]).filter(r=>r.estId===est.id)
          .map(r=>{ const m={ en_revision:['Plan enviado a revisión','En revisión del apoderado','plan'], cambios:['Cambios solicitados por el apoderado','El equipo está ajustando el plan','alerta'], respondido:['Respuesta enviada al apoderado','Requiere entrevista','plan'], firmado:[r.planNombre+' firmado por apoderado','En ronda de firmas del equipo','plan'], archivado:[r.planNombre+' finalizado','Firmado por el equipo · Folio '+(r.folio||''),'hito'] }[r.estado]||[r.planNombre+' en elaboración','Borrador del equipo','plan']; return { a:'2026', t:m[0], d:m[1], k:m[2], vivo:['firmado','archivado','cambios'].includes(r.estado) }; });
        const hitos=[...base,...vivos];
        if(hitos.length===0) return null;
        return (
        <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:16, marginBottom:12 }}>
          <div style={{ fontSize:12.5, fontWeight:800, color:t.ink, marginBottom:3 }}>Trayectoria del estudiante</div>
          <div style={{ fontSize:10.5, color:t.muted, marginBottom:14 }}>Todo su recorrido en el programa, de un vistazo. {vivos.length>0 && <span style={{ color:t.primary, fontWeight:700 }}>Se actualiza sola con cada acción.</span>}</div>
          <div style={{ position:'relative', paddingLeft:6 }}>
            {hitos.map((h,i)=>{ const C={ doc:{c:'#6B6F92',i:'doc'}, diag:{c:'#7A4FB0',i:'spark'}, plan:{c:'#185FA5',i:'doc'}, hito:{c:'#1E7A53',i:'check'}, alerta:{c:'#B23A24',i:'bell'} }[h.k]||{c:t.primary,i:'doc'}; const last=i===hitos.length-1; return (
              <div key={i} style={{ display:'flex', gap:12, position:'relative' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                  <div style={{ width:30, height:30, borderRadius:'50%', background:C.c+'1a', border:`2px solid ${C.c}`, display:'flex', alignItems:'center', justifyContent:'center', zIndex:1 }}><Icon k={C.i} c={C.c} s={15} /></div>
                  {!last && <div style={{ width:2, flex:1, minHeight:22, background:t.border }} />}
                </div>
                <div style={{ paddingBottom:last?0:14 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}><span style={{ fontSize:10, fontWeight:800, color:C.c, background:C.c+'18', padding:'1px 8px', borderRadius:99 }}>{h.a}</span><span style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{h.t}</span>{h.vivo && <span style={{ fontSize:9, fontWeight:800, color:'#1E7A53', background:'#E2F3EC', padding:'1px 7px', borderRadius:99 }}>NUEVO</span>}</div>
                  <div style={{ fontSize:11, color:t.muted, marginTop:3, lineHeight:1.4 }}>{h.d}</div>
                </div>
              </div>
            );})}
          </div>
        </div>
        );
      })()}

      {/* documentos del estudiante (#1): informe médico + planes */}
      {(()=>{
        const rec = inf.data[est.id] || (esSeedDemo(est)?{nombre:'Informe Neurología.pdf',fecha:'10 jun 2026',origen:'Apoderado'}:null);
        const planes = (revisiones||[]).filter(r=>r.estId===est.id);
        if(!rec && planes.length===0) return null;
        const estLbl={ en_revision:['En revisión del apoderado','#C2841E','#FBF1DE'], cambios:['Cambios solicitados','#B23A24','#FBE6E2'], respondido:['Respondido al apoderado','#2563B8','#E8F0FB'], firmado:['Firmado por apoderado','#185FA5','#E8F0FB'], archivado:['Finalizado y archivado','#1E7A53','#E2F3EC'] };
        return (
        <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:16, marginBottom:12 }}>
          <div style={{ fontSize:12.5, fontWeight:800, color:t.ink, marginBottom:11 }}>Documentos del estudiante</div>
          {rec && (
            <div style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 12px', background:t.soft, borderRadius:10, marginBottom:planes.length?8:0 }}>
              <Icon k="doc" c={DOC_CATS.informe.color} s={19} />
              <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{rec.nombre||'Informe médico'}</div><div style={{ fontSize:10.5, color:t.muted }}>{/apoderado/i.test(rec.origen||'')?'Recibido del apoderado':'Cargado por el equipo'} · {rec.fecha||'—'}</div></div>
              <span style={{ fontSize:9.5, fontWeight:800, color:t.primaryDark, background:t.card, padding:'2px 9px', borderRadius:99, flexShrink:0 }}>Informe</span>
            </div>
          )}
          {planes.map(p=>{ const e=estLbl[p.estado]||['En elaboración','#6B6F92',t.soft]; const cat=DOC_CATS[p.planId]||DOC_CATS.informe; return (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 12px', background:t.soft, borderRadius:10, marginTop:8, borderLeft:`4px solid ${cat.color}` }}>
              <Icon k="doc" c={cat.color} s={19} />
              <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{p.planNombre||p.planId}</div><div style={{ fontSize:10.5, color:t.muted }}>{p.fecha||''}{p.folio?' · Folio '+p.folio:''}</div></div>
              <span style={{ fontSize:9.5, fontWeight:800, color:e[1], background:e[2], padding:'2px 9px', borderRadius:99, flexShrink:0 }}>{e[0]}</span>
            </div>
          );})}
        </div>
        );
      })()}
      <DesregFicha t={t} estId={est.id} editable />
      <MedFicha t={t} estId={est.id} />

      {/* gestión del caso */}
      <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:16, marginBottom:12 }}>
        <div style={{ fontSize:12.5, fontWeight:800, color:t.ink, marginBottom:11 }}>Gestión del caso</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
          <div>
            <label style={{ fontSize:10, fontWeight:700, color:t.muted, display:'block', marginBottom:4 }}>Responsable del caso</label>
            <select value={caso.responsable} onChange={e=>setCaso(c=>({...c,responsable:e.target.value}))} style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, background:t.card }}>
              <option value="">— Asignar —</option>
              {['Educadora Diferencial','Psicóloga','Terapeuta Ocupacional','Psicopedagoga'].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:10, fontWeight:700, color:t.muted, display:'block', marginBottom:4 }}>Próxima revisión</label>
            <input type="date" value={caso.revision} onChange={e=>setCaso(c=>({...c,revision:e.target.value}))} style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, background:t.card, color:t.ink }} />
          </div>
        </div>
        {caso.revision && (()=>{ const dias=Math.ceil((new Date(caso.revision)-new Date())/86400000); const venc=dias<0, pronto=dias>=0&&dias<=14; return (
          <div style={{ background:venc?'#FBE6E2':pronto?'#E8F0FB':t.soft, borderRadius:9, padding:'8px 12px', marginBottom:12, fontSize:11, fontWeight:600, color:venc?'#B23A24':pronto?'#2563B8':t.muted }}>
            {venc?`Revisión vencida hace ${Math.abs(dias)} días`:pronto?`Revisión en ${dias} días`:`Próxima revisión programada en ${dias} días`}
          </div>
        );})()}
        <div style={{ fontSize:10.5, fontWeight:800, color:t.primaryDark, textTransform:'uppercase', letterSpacing:0.4, marginBottom:7 }}>Bitácora de entrevistas</div>
        {caso.entrevistas.map((e,i)=>(
          <div key={i} style={{ display:'flex', gap:9, marginBottom:7 }}>
            <span style={{ fontSize:9.5, color:t.muted, fontWeight:700, flexShrink:0, width:64, paddingTop:1 }}>{e.fecha}</span>
            <span style={{ fontSize:11.5, color:t.ink, lineHeight:1.4 }}>{e.nota}</span>
          </div>
        ))}
        <div style={{ display:'flex', gap:7, marginTop:8 }}>
          <input value={entTxt} onChange={e=>setEntTxt(e.target.value)} placeholder="Registrar nueva entrevista…" style={{ flex:1, padding:'8px 11px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, outline:'none' }} />
          <button onClick={addEntrevista} style={{ background:t.primary, color:'#fff', border:'none', borderRadius:8, padding:'8px 14px', fontSize:11.5, fontWeight:700, cursor:'pointer', flexShrink:0 }}>＋</button>
        </div>
      </div>

      {/* expediente del estudiante */}
      </React.Fragment>)}
      {tab==='documentos' && (<React.Fragment>
      <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:16, marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:3 }}>
          <div style={{ fontSize:12.5, fontWeight:800, color:t.ink }}>Expediente del estudiante</div>
          <button onClick={()=>{ imprimirExpediente(est, revisiones); onToast('Expediente completo generado'); }} style={{ flexShrink:0, background:t.primary, color:'#fff', border:'none', borderRadius:9, padding:'7px 12px', fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}><Icon k="download" c="#fff" s={15} />Descargar expediente</button>
        </div>
        <div style={{ fontSize:11, color:t.muted, marginBottom:12 }}>Carpeta única del estudiante: todos sus documentos en un lugar. Toca uno para verlo, o descarga el expediente completo.</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {/* informe de origen */}
          {tieneInforme ? (
          <div style={{ display:'flex', alignItems:'center', gap:0, background:t.card, border:`1px solid ${t.border}`, borderLeft:`4px solid ${DOC_CATS.informe.color}`, borderRadius:12, overflow:'hidden' }}>
            <button onClick={()=>setVerInforme(true)} style={{ flex:1, minWidth:0, textAlign:'left', cursor:'pointer', background:'none', border:'none', padding:'11px 13px', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:DOC_CATS.informe.color+'1a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="doc" c={DOC_CATS.informe.color} s={18} /></div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{esSeedDemo(est)?'Informe Neurología.pdf':((inf.data[est.id]&&inf.data[est.id].nombre)||'Informe médico')}</div>
                <div style={{ fontSize:10, color:t.muted, marginTop:1 }}>{DOC_CATS.informe.label} · {esSeedDemo(est)?'del apoderado · 10 jun 2026':`cargado por ${(inf.data[est.id]&&inf.data[est.id].origen)||'Equipo'} · ${inf.data[est.id]&&inf.data[est.id].fecha||''}`}</div>
              </div>
            </button>
            <button onClick={async ()=>{ const r=inf.data[est.id]; const u=await urlInforme(r); if(u){ const a=document.createElement('a'); a.href=u; a.download=r.nombre||'informe'; a.target='_blank'; a.click(); onToast('Descargando '+(r.nombre||'archivo')); } else { imprimirInformeMedico(est); onToast('Descargando informe médico'); } }} title="Descargar" style={{ flexShrink:0, background:'none', border:'none', borderLeft:`1px solid ${t.border}`, padding:'0 14px', alignSelf:'stretch', cursor:'pointer', color:DOC_CATS.informe.color }}><Icon k="download" c={DOC_CATS.informe.color} s={17} /></button>
          </div>
          ) : (
          <div style={{ background:t.card, border:`1px dashed ${t.border}`, borderRadius:12, padding:'14px 15px', textAlign:'center' }}>
            <div style={{ width:38, height:38, borderRadius:10, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px' }}><Icon k="doc" c={t.muted} s={19} /></div>
            <div style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>Aún no hay informe médico cargado</div>
            <div style={{ fontSize:10.5, color:t.muted, marginTop:2, lineHeight:1.5 }}>Llega cuando el apoderado lo sube y el equipo lo procesa. Si lo tienes en mano, cárgalo directamente (PDF o imagen).</div>
            <label style={{ marginTop:11, padding:'9px 16px', background:t.primary, color:'#fff', border:'none', borderRadius:9, fontSize:12, fontWeight:700, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:7 }}><Icon k="download" c="#fff" s={15} />Seleccionar archivo…<input type="file" accept="application/pdf,image/*" style={{ display:'none' }} onChange={async (e)=>{ const f=e.target.files&&e.target.files[0]; if(!f){ return; } const esImagen=/^image\//.test(f.type); if(!esImagen && f.size>10*1024*1024){ onToast('El PDF supera 10 MB; comprímelo o súbelo como foto'); e.target.value=''; return; } onToast('Subiendo informe…'); try{ const meta=await subirInformeArchivo(est.id, f); inf.cargar(est.id, meta); onToast('Informe cargado: '+f.name); }catch(err){ onToast('No se pudo subir el informe: '+(err.message||'error')); } e.target.value=''; }} /></label>
          </div>
          )}
          {/* planes */}
          {PLANES.map(p=>{
            const cat=DOC_CATS[p.id]; const activo=planId===p.id;
            const estadoPlan = estadoDePlan(p.id);
            const tone = (estadoPlan==='Firmado'||estadoPlan==='Finalizado')?'ok':(estadoPlan==='No iniciado'?'soft':'warn');
            return (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:0, background:activo?cat.color+'0d':t.card, border:`1px solid ${activo?cat.color:t.border}`, borderLeft:`4px solid ${cat.color}`, borderRadius:12, overflow:'hidden', transition:'all .15s' }}>
                <button onClick={()=>{ setTab('nee'); cambiarPlan(p.id); }} style={{ flex:1, minWidth:0, textAlign:'left', cursor:'pointer', background:'none', border:'none', padding:'11px 13px', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:cat.color+'1a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k={cat.icon} c={cat.color} s={18} /></div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{p.nombre} · <span style={{ fontWeight:500, color:t.muted }}>{p.full}</span></div>
                    <div style={{ fontSize:10, fontWeight:700, color:cat.color, marginTop:1, textTransform:'uppercase', letterSpacing:0.4 }}>{cat.label}</div>
                  </div>
                  <Chip t={t} label={estadoPlan} tone={tone} />
                </button>
                <button onClick={()=>descargarPlan(p)} title="Descargar" style={{ flexShrink:0, background:'none', border:'none', borderLeft:`1px solid ${activo?cat.color+'55':t.border}`, padding:'0 14px', alignSelf:'stretch', cursor:'pointer', color:cat.color }}><Icon k="download" c={cat.color} s={17} /></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* plan de trabajo académico */}
      </React.Fragment>)}
      {tab==='academico' && (
      <PlanTrabajoAcademico t={t} est={est} tutor="María Paz Herrera" />
      )}

      {tab==='nee' && (<React.Fragment>
      {/* elección: IA o manual */}
      {phase!=='listo' && (
        <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:18, marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon k="doc" c={t.primary} s={21} /></div>
            <div><div style={{ fontSize:13, fontWeight:700, color:t.ink }}>{esSeedDemo(est)?'Informe Neurología.pdf':((inf.data[est.id]&&inf.data[est.id].nombre)||'Informe médico')}</div><div style={{ fontSize:10.5, color:t.muted }}>{esSeedDemo(est)?'Recibido del apoderado · 10 jun 2026':`${inf.data[est.id]&&/apoderado/i.test(inf.data[est.id].origen||'')?'Recibido del apoderado':'Cargado por el equipo'} · ${(inf.data[est.id]&&inf.data[est.id].fecha)||'hoy'}`}</div></div>
          </div>
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:8 }}>¿Cómo quieres crear la planilla?</div>
          <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
            {PLANES.map(p=>(
              <button key={p.id} onClick={()=>cambiarPlan(p.id)} style={{ padding:'7px 14px', borderRadius:99, fontSize:11.5, fontWeight:700, cursor:'pointer', border:`1px solid ${planId===p.id?t.primary:t.border}`, background:planId===p.id?t.primary:t.card, color:planId===p.id?'#fff':t.muted }}>{p.nombre}{revDe(p.id)?' ✓':''}</button>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <button onClick={generar} disabled={phase==='generando'} style={{ padding:'16px 14px', background:phase==='generando'?t.primaryDark:t.accent, color:phase==='generando'?'#fff':t.ink, border:'none', borderRadius:12, cursor:'pointer', textAlign:'left' }}>
              <Icon k="spark" c={phase==='generando'?'#fff':t.ink} s={20} />
              <div style={{ fontSize:13, fontWeight:800, marginTop:6 }}>{phase==='generando'?'Leyendo informe…':'Autocompletar con IA'}</div>
              <div style={{ fontSize:10.5, opacity:0.8, marginTop:2 }}>La IA lee el informe y propone las adecuaciones</div>
            </button>
            <button onClick={manual} disabled={phase==='generando'} style={{ padding:'16px 14px', background:t.card, color:t.ink, border:`1.5px solid ${t.border}`, borderRadius:12, cursor:'pointer', textAlign:'left' }}>
              <Icon k="doc" c={t.primary} s={20} />
              <div style={{ fontSize:13, fontWeight:800, marginTop:6 }}>Completar manualmente</div>
              <div style={{ fontSize:10.5, color:t.muted, marginTop:2 }}>Planilla en blanco, formato del colegio</div>
            </button>
          </div>
          <button onClick={aplicarPlantilla} disabled={phase==='generando'} style={{ width:'100%', marginTop:10, padding:'11px 14px', background:t.soft, color:t.primaryDark, border:'none', borderRadius:12, cursor:'pointer', fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <Icon k="check" c={t.primary} s={17} />Aplicar plantilla por diagnóstico ({((datos.diag||est.diag)||'').split(' ')[0]})
          </button>
        </div>
      )}
      {phase==='listo' && (
        <div className="fade">
          <div style={{ display:'flex', gap:8, marginBottom:12, alignItems:'center', flexWrap:'wrap' }}>
            {PLANES.map(p=>(
              <button key={p.id} onClick={()=>cambiarPlan(p.id)} style={{ padding:'7px 14px', borderRadius:99, fontSize:11.5, fontWeight:700, cursor:'pointer', border:`1px solid ${planId===p.id?t.primary:t.border}`, background:planId===p.id?t.primary:t.card, color:planId===p.id?'#fff':t.muted }}>{p.nombre}{revDe(p.id)?' ✓':''}</button>
            ))}
            <span style={{ marginLeft:'auto' }}><Chip t={t} label={modo==='manual'?'Manual':'Autocompletado con IA'} tone={modo==='manual'?'soft':'ok'} /></span>
          </div>

          {iaSintesis && modo==='ia' && (
            <div style={{ background:'#F3EEFA', border:'1px solid #D9C9F0', borderLeft:`4px solid #7A4FB0`, borderRadius:t.radius, padding:'14px 16px', marginBottom:12 }} className="fade">
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}><Icon k="spark" c="#7A4FB0" s={16} /><span style={{ fontSize:12, fontWeight:800, color:'#7A4FB0' }}>Lectura del informe por IA</span></div>
              {iaSintesis.resumen && <div style={{ fontSize:12, color:t.ink, lineHeight:1.5, marginBottom:iaSintesis.objetivos.length?10:0 }}>{iaSintesis.resumen}</div>}
              {iaSintesis.objetivos.length>0 && (<React.Fragment>
                <div style={{ fontSize:10, fontWeight:800, color:'#7A4FB0', textTransform:'uppercase', letterSpacing:0.4, marginBottom:5 }}>Objetivos propuestos</div>
                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                  {iaSintesis.objetivos.map((o,i)=>(<div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start' }}><span style={{ width:17, height:17, borderRadius:'50%', background:'#7A4FB0', color:'#fff', fontSize:9, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{i+1}</span><span style={{ fontSize:11.5, color:t.ink, lineHeight:1.4 }}>{o}</span></div>))}
                </div>
              </React.Fragment>)}
              <div style={{ fontSize:9.5, color:t.muted, marginTop:9, fontStyle:'italic' }}>Borrador generado por IA · revisa y ajusta antes de enviar.</div>
            </div>
          )}

          <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, overflow:'hidden', marginBottom:12 }}>
            <div style={{ background:t.headerGrad, color:'#fff', padding:'16px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
              <div><div style={{ fontFamily:t.display, fontSize:16, fontWeight:600 }}>{plan.full}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', marginTop:2 }}>{plan.nombre} · {est.nombre}</div></div>
              {tieneInforme && <button onClick={()=>setVerInforme(true)} style={{ flexShrink:0, background:'rgba(255,255,255,0.16)', color:'#fff', border:'none', borderRadius:9, padding:'8px 12px', fontSize:11, fontWeight:700, cursor:'pointer' }}>Ver informe médico</button>}
            </div>
            <div style={{ padding:'16px 18px' }}>
              <SectTitle t={t}>Identificación del estudiante</SectTitle>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'9px 14px', marginBottom:18 }}>
                {[['Nombre',est.nombre],['Curso',est.curso],['Edad',datos.edad||est.edad],['Diagnóstico',datos.diag||est.diag],['Establecimiento','Colegio Mayor Peñalolén'],['Fecha elaboración',new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'short',year:'numeric'})]].map(([k,v])=>(
                  <div key={k}>
                    <div style={{ fontSize:9.5, fontWeight:700, color:t.muted, textTransform:'uppercase', letterSpacing:0.5 }}>{k}</div>
                    {modo==='manual'
                      ? <input defaultValue={k==='Establecimiento'?v:(['Nombre','Curso','Edad','Diagnóstico'].includes(k)?v:'')} placeholder="Completar…" style={{ width:'100%', marginTop:3, padding:'5px 8px', fontSize:12, border:`1px solid ${t.border}`, borderRadius:7, outline:'none', color:t.ink }} />
                      : <div style={{ fontSize:12.5, color:t.ink, marginTop:2, fontWeight:500 }}>{v}</div>}
                  </div>
                ))}
              </div>

              <SectTitle t={t}>Equipo responsable <span style={{ fontWeight:500, color:t.muted, fontSize:10.5 }}>· marca quiénes participan</span></SectTitle>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18 }}>
                {EQUIPO_ROLES.map((r)=>{ const on=equipo[r]; return (
                  <button key={r} onClick={()=>toggleEquipo(r)} style={{ cursor:'pointer', fontSize:11, fontWeight:700, padding:'5px 13px', borderRadius:99, border:`1px solid ${on?t.primary:t.border}`, background:on?t.primary:t.card, color:on?'#fff':t.muted }}>{on?'✓ ':''}{r}</button>
                );})}
              </div>

              <SectTitle t={t}>{planId==='PAEC'?'Adecuaciones evaluativas':'Adecuaciones de acceso'} <span style={{ fontWeight:500, color:t.muted, fontSize:10.5 }}>· {modo==='manual'?'marca las que correspondan':'marcadas por la IA, editables'}</span></SectTitle>
              {adecSet.map((g,gi)=>(
                <div key={gi} style={{ marginBottom:13 }}>
                  <div style={{ fontSize:11.5, fontWeight:700, color:t.primaryDark, marginBottom:6 }}>{g.tipo}</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                    {g.items.map((it,ii)=>{ const k=gi+'-'+ii; const on=marcadas[k]; return (
                      <button key={ii} onClick={()=>toggle(k)} style={{ display:'flex', alignItems:'flex-start', gap:9, textAlign:'left', cursor:'pointer', background:'none', border:'none', padding:0 }}>
                        <span style={{ width:18, height:18, borderRadius:5, flexShrink:0, marginTop:1, border:`1.5px solid ${on?t.primary:t.border}`, background:on?t.primary:t.card, display:'flex', alignItems:'center', justifyContent:'center' }}>{on && <Icon k="check" c="#fff" s={12} />}</span>
                        <span style={{ fontSize:12, color:on?t.ink:t.muted, lineHeight:1.4 }}>{it}</span>
                      </button>
                    );})}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginTop:8, paddingTop:8, borderTop:`1px dashed ${t.border}` }}>
                    <span style={{ fontSize:10, fontWeight:700, color:t.muted, textTransform:'uppercase', letterSpacing:0.4, marginRight:2 }}>Responsables:</span>
                    {RESPONSABLES.map((r,ri)=>{ const rk=gi+'-'+ri; const on=resp[rk]; return (
                      <button key={ri} onClick={()=>toggleResp(rk)} style={{ cursor:'pointer', fontSize:10.5, fontWeight:700, padding:'3px 10px', borderRadius:99, border:`1px solid ${on?t.primary:t.border}`, background:on?t.primary:t.card, color:on?'#fff':t.muted }}>{r}</button>
                    );})}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'12px 15px', marginBottom:12 }}>
            <label style={{ fontSize:11.5, fontWeight:700, color:t.ink, display:'block', marginBottom:6 }}>Observaciones <span style={{ fontWeight:500, color:t.muted }}>· se incluyen en el documento</span></label>
            <textarea value={obs} onChange={e=>setObs(e.target.value)} rows={3} placeholder="Escribe aquí las observaciones del equipo…" style={{ width:'100%', padding:'9px 11px', borderRadius:9, border:`1px solid ${t.border}`, fontSize:12, resize:'vertical', outline:'none', fontFamily:'inherit', color:t.ink }} />
          </div>

          <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'12px 15px', marginBottom:12, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            <span style={{ fontSize:11.5, fontWeight:700, color:t.ink }}>Director/a de Ciclo:</span>
            <select value={director} onChange={e=>setDirector(e.target.value)} style={{ flex:1, minWidth:180, padding:'8px 11px', borderRadius:9, border:`1px solid ${t.border}`, fontSize:12, background:t.card, color:t.ink, fontWeight:600 }}>
              <option value="">— Selecciona —</option>
              <option value="José Miguel Arriagada R.">José Miguel Arriagada R.</option>
              <option value="Claudia Pantoja H.">Claudia Pantoja H.</option>
            </select>
            <div style={{ width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:9, marginTop:4 }}>
              <div><label style={{ fontSize:9.5, fontWeight:700, color:t.muted, display:'block', marginBottom:3 }}>Fecha de nacimiento</label><input type="date" value={datos.nacimiento} onChange={e=>setDatos(d=>({...d,nacimiento:e.target.value}))} style={{ width:'100%', padding:'7px 9px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, background:t.card, color:t.ink }} /></div>
              <div><label style={{ fontSize:9.5, fontWeight:700, color:t.muted, display:'block', marginBottom:3 }}>Edad</label><input value={datos.edad} onChange={e=>setDatos(d=>({...d,edad:e.target.value}))} placeholder="Ej: 12 años" style={{ width:'100%', padding:'7px 9px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, background:t.card, color:t.ink }} /></div>
              <div><label style={{ fontSize:9.5, fontWeight:700, color:t.muted, display:'block', marginBottom:3 }}>Diagnóstico</label><input value={datos.diag} onChange={e=>setDatos(d=>({...d,diag:e.target.value}))} placeholder="Según informe" style={{ width:'100%', padding:'7px 9px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, background:t.card, color:t.ink }} /></div>
            </div>
            <div style={{ width:'100%', fontSize:9.5, color:t.muted }}>Estos datos se imprimen en el documento oficial y los ve el apoderado al descargar.</div>
          </div>

          <div style={{ display:'flex', gap:9, flexWrap:'wrap' }}>
            {(revEstado==='firmado' || revEstado==='archivado') ? null : (
              <div style={{ width:'100%' }}>
                <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'12px 15px', marginBottom:10 }}>
                  <div style={{ fontSize:11.5, fontWeight:800, color:t.ink, marginBottom:8 }}>¿Quiénes deben firmar este documento?</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                    {FIRMANTES_ROLES.map(r=>{ const on=firmantesSel[r]; return (
                      <button key={r} onClick={()=>toggleFirmante(r)} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 11px', borderRadius:99, fontSize:11, fontWeight:700, cursor:'pointer', border:`1px solid ${on?t.primary:t.border}`, background:on?t.primary:t.card, color:on?'#fff':t.muted }}>
                        <span style={{ width:14, height:14, borderRadius:4, border:`1.5px solid ${on?'#fff':t.border}`, background:on?'rgba(255,255,255,0.25)':t.card, display:'flex', alignItems:'center', justifyContent:'center' }}>{on && <Icon k="check" c="#fff" s={10} />}</span>
                        {r}
                      </button>
                    );})}
                  </div>
                  <div style={{ fontSize:9.5, color:t.muted, marginTop:7 }}>El apoderado siempre firma. Marca solo los miembros del equipo que deben firmar.</div>
                </div>
                <button onClick={()=>{ enviarRevision({ estId:est.id, planId, estNombre:est.nombre, curso:est.curso, planNombre:plan.nombre, planFull:plan.full, marcadas:{...marcadas}, adecKey:planId, director, equipo:{...equipo}, resp:{...resp}, firmantes:Object.keys(firmantesSel).filter(k=>firmantesSel[k]), obs }); onToast('Enviado a revisión del apoderado'); }}
                disabled={revEstado==='en_revision'}
                style={{ width:'100%', padding:13, background: revEstado==='en_revision'?t.soft:t.primary, color: revEstado==='en_revision'?t.muted:'#fff', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor: revEstado==='en_revision'?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <Icon k="bell" c={revEstado==='en_revision'?t.muted:'#fff'} s={17} />{revEstado==='en_revision'?'Esperando revisión del apoderado…':revEstado==='cambios'?'Reenviar a revisión':'Enviar a revisión del apoderado'}
              </button>
              </div>
            )}
          </div>

          {/* línea de tiempo de aprobación */}
          <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:0 }}>
            {[['Enviado','en_revision'],['Revisado','cambios'],['Firmado','firmado']].map(([lbl,st],i)=>{
              const active = i===0 ? (revEstado!=='borrador') : i===1 ? ['cambios','respondido','firmado','archivado'].includes(revEstado) : ['firmado','archivado'].includes(revEstado);
              return (
                <React.Fragment key={lbl}>
                  {i>0 && <div style={{ flex:1, height:2, background: active?t.primary:t.border }} />}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', background: active?t.primary:t.card, border:`2px solid ${active?t.primary:t.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>{active && <Icon k="check" c="#fff" s={12} />}</div>
                    <span style={{ fontSize:9.5, color: active?t.ink:t.muted, fontWeight:active?700:500 }}>{lbl}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          {revEstado==='cambios' && rev?.obsApoderado && (
            <div style={{ marginTop:12, background:'#FBE6E2', border:'1px solid #E8B4AA', borderRadius:10, padding:'10px 13px' }}>
              <div style={{ fontSize:11, fontWeight:800, color:'#B23A24', marginBottom:3 }}>El apoderado solicitó cambios:</div>
              <div style={{ fontSize:11.5, color:'#7A2A1A', lineHeight:1.45 }}>“{rev.obsApoderado}”</div>
              <button onClick={()=>{
                const equipoObs = (obs && obs.trim()) ? obs.trim() : ((rev.obs && rev.obs.trim()) ? rev.obs.trim() : '');
                setObs(equipoObs);
                enviarRevision({ estId:est.id, planId, estNombre:est.nombre, curso:est.curso, planNombre:plan.nombre, planFull:plan.full, marcadas:{...marcadas}, adecKey:planId, director, equipo:{...equipo}, resp:{...resp}, firmantes:Object.keys(firmantesSel).filter(k=>firmantesSel[k]), obs:equipoObs, solicitudApoderado:rev.obsApoderado });
                onToast('✓ Cambios incorporados · reenviado al apoderado para firma');
              }} style={{ marginTop:10, width:'100%', padding:11, background:t.primary, color:'#fff', border:'none', borderRadius:10, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                <Icon k="check" c="#fff" s={15} />Incorporar cambios y reenviar a firma
              </button>
              <div style={{ fontSize:9.5, color:'#9A6A12', marginTop:6, textAlign:'center' }}>Se agregará a Observaciones y volverá al apoderado para firmar.</div>
              {!mostrarResp ? (
                <button onClick={()=>setMostrarResp(true)} style={{ marginTop:8, width:'100%', padding:10, background:t.card, color:'#B23A24', border:'1px solid #E8B4AA', borderRadius:10, fontSize:11.5, fontWeight:700, cursor:'pointer' }}>
                  ¿No está de acuerdo? Responder / agendar entrevista
                </button>
              ) : (
                <div style={{ marginTop:8 }}>
                  <textarea value={respTxt} onChange={e=>setRespTxt(e.target.value)} rows={4} style={{ width:'100%', padding:'9px 11px', borderRadius:9, border:`1px solid ${t.border}`, fontSize:11, resize:'vertical', outline:'none', fontFamily:'inherit', color:t.ink }} />
                  <div style={{ display:'flex', gap:8, marginTop:7 }}>
                    <button onClick={()=>setMostrarResp(false)} style={{ flex:1, padding:9, background:t.card, color:t.muted, border:`1px solid ${t.border}`, borderRadius:9, fontSize:11, fontWeight:700, cursor:'pointer' }}>Cancelar</button>
                    <button onClick={()=>{ if(!respTxt.trim())return; responderApoderado(rev.id, respTxt); setMostrarResp(false); onToast('Respuesta enviada al apoderado'); }} style={{ flex:1.4, padding:9, background:'#B23A24', color:'#fff', border:'none', borderRadius:9, fontSize:11, fontWeight:700, cursor:'pointer' }}>Enviar respuesta</button>
                  </div>
                </div>
              )}
            </div>
          )}
          {(revEstado==='firmado' || revEstado==='archivado') && (
            <div style={{ marginTop:12 }}>
              <div style={{ background:'#E2F3EC', border:'1px solid #A8D8C0', borderRadius:10, padding:'10px 13px', display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <Icon k="check" c="#1E7A53" s={18} />
                <div style={{ fontSize:11.5, color:'#1E5A40', lineHeight:1.45 }}><b>Firmado por el apoderado</b> · {rev.fechaFirma} · Folio {rev.folio}</div>
              </div>
              {(() => {
                const fi = rev.firmasInternas||[]; const hechas = fi.filter(f=>f.firma).length; const completo = revEstado==='archivado';
                return (
                  <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'13px 15px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                      <span style={{ fontSize:12.5, fontWeight:800, color:t.ink }}>Registro de firmas del equipo</span>
                      <span style={{ background:completo?'#E2F3EC':t.soft, color:completo?'#1E7A53':t.primaryDark, fontSize:11, fontWeight:800, padding:'2px 10px', borderRadius:99 }}>{hechas}/{fi.length}</span>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0' }}>
                        <span style={{ width:22, height:22, borderRadius:'50%', background:'#1E7A53', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="check" c="#fff" s={13} /></span>
                        <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:700, color:t.ink }}>Apoderado(a)</div><div style={{ fontSize:10, color:t.muted }}>{rev.fechaFirma}</div></div>
                      </div>
                      {fi.map((f,i)=>(
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderTop:`1px solid ${t.border}` }}>
                          <span style={{ width:22, height:22, borderRadius:'50%', background:f.firma?'#1E7A53':t.soft, border:f.firma?'none':`1.5px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{f.firma && <Icon k="check" c="#fff" s={13} />}</span>
                          <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:12, fontWeight:700, color:t.ink }}>{f.rol}</div><div style={{ fontSize:10, color:t.muted }}>{f.firma?f.fecha:'Pendiente de firma'}</div></div>
                          {!f.firma && <button onClick={()=>setFirmandoIdx(i)} style={{ background:t.primary, color:'#fff', border:'none', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:700, cursor:'pointer', flexShrink:0 }}>Firmar</button>}
                        </div>
                      ))}
                    </div>
                    {firmandoIdx!==null && (
                      <div style={{ marginTop:12 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:t.ink, marginBottom:7 }}>Firma de {fi[firmandoIdx].rol}</div>
                        <FirmaDigital t={t} rev={rev} soloFirma onCancel={()=>setFirmandoIdx(null)} onFirmar={(firma)=>{ auditPush(fi[firmandoIdx].rol, `firmó documento de ${est.nombre} (${normCurso(est.curso)})`); firmarInterno(rev.id, firmandoIdx, firma); setFirmandoIdx(null); onToast('✓ Firma registrada'); }} />
                      </div>
                    )}
                    {completo && (
                      <div style={{ marginTop:12, background:'#E2F3EC', border:'1px solid #A8D8C0', borderRadius:10, padding:'11px 13px', textAlign:'center' }}>
                        <div style={{ fontSize:12, fontWeight:800, color:'#1E5A40', marginBottom:8 }}>✓ Todas las firmas completas · documento listo para archivar</div>
                        <button onClick={()=>{ imprimirOficial(plan, est, marcadas, adecSet, '17 jun 2026', resp, director, equipo, (obs||(rev&&rev.obs)||''), rev); onToast('Documento impreso y archivado'); }} style={{ width:'100%', padding:11, background:t.primary, color:'#fff', border:'none', borderRadius:10, fontSize:12.5, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}><Icon k="print" c="#fff" s={16} />Imprimir y archivar</button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
      </React.Fragment>)}
      {verInforme && <InformeModal t={t} est={est} rec={inf.data[est.id]} demo={esSeedDemo(est)} onClose={()=>setVerInforme(false)} />}
      <Toast t={t} msg={toast} />
    </div>
  );
}

// ─── Visor del informe médico externo ────────────────────────────
function InformeModal({ t, est, rec, demo, onClose }){
  const real = rec && (rec.dataUrl || rec.path);
  const titulo = (rec && rec.nombre) || 'Informe Neurología.pdf';
  const esImg = real && /^image\//.test((rec && rec.tipo)||'');
  const [url,setUrl] = useState(rec && rec.dataUrl ? rec.dataUrl : null);
  useEffect(()=>{ let vivo=true; if(real && !url){ urlInforme(rec).then(u=>{ if(vivo) setUrl(u); }); } return ()=>{ vivo=false; }; },[real]);
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(20,28,45,0.55)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, zIndex:150 }} className="fade">
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:14, maxWidth:560, width:'100%', maxHeight:'88vh', overflowY:'auto', boxShadow:'0 30px 80px rgba(0,0,0,0.4)' }} className="scale">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:`1px solid ${t.border}`, position:'sticky', top:0, background:'#fff' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}><Icon k="doc" c={t.primary} s={20} /><span style={{ fontSize:13.5, fontWeight:700, color:t.ink }}>{titulo}</span></div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:18, color:t.muted, cursor:'pointer' }}>✕</button>
        </div>
        {real ? (
          <div style={{ padding:16 }}>
            {!url
              ? <div style={{ padding:'40px 0', textAlign:'center', color:t.muted, fontSize:12.5 }}>Cargando informe…</div>
              : esImg
                ? <img src={url} alt={titulo} style={{ width:'100%', borderRadius:8, display:'block' }} />
                : <iframe src={url} title={titulo} style={{ width:'100%', height:'70vh', border:'none', borderRadius:8 }} />}
            {url && <a href={url} download={titulo} target="_blank" style={{ display:'inline-flex', alignItems:'center', gap:7, marginTop:12, padding:'9px 16px', background:t.primary, color:'#fff', borderRadius:9, fontSize:12, fontWeight:700, textDecoration:'none' }}><Icon k="download" c="#fff" s={15} />Descargar archivo</a>}
          </div>
        ) : demo ? (
        <div style={{ padding:'26px 30px', fontSize:12.5, color:'#2a2f45', lineHeight:1.6 }}>
          <div style={{ textAlign:'center', borderBottom:'2px solid #ddd', paddingBottom:14, marginBottom:18 }}>
            <div style={{ fontSize:15, fontWeight:800, color:'#1B1F3B' }}>CENTRO MÉDICO NEURODESARROLLO</div>
            <div style={{ fontSize:10.5, color:'#888', marginTop:3 }}>Dra. Carolina Méndez · Neuróloga infantil · RUT 12.345.678-9</div>
          </div>
          <div style={{ fontWeight:800, fontSize:13, color:'#1B1F3B', marginBottom:10 }}>INFORME DE EVALUACIÓN NEUROLÓGICA</div>
          {[['Paciente',est.nombre],['Edad',est.edad],['Fecha','10 de junio de 2026'],['Motivo','Evaluación por dificultades atencionales']].map(([k,v])=>(
            <div key={k} style={{ display:'flex', gap:8, marginBottom:4 }}><span style={{ fontWeight:700, minWidth:90, color:'#555' }}>{k}:</span><span>{v}</span></div>
          ))}
          <div style={{ fontWeight:800, fontSize:12, color:'#1B1F3B', margin:'16px 0 6px' }}>DIAGNÓSTICO</div>
          <p>{est.diag}. Se observa adecuado desarrollo cognitivo general, con dificultades específicas en atención sostenida y autorregulación.</p>
          <div style={{ fontWeight:800, fontSize:12, color:'#1B1F3B', margin:'16px 0 6px' }}>SUGERENCIAS PARA EL ESTABLECIMIENTO</div>
          <ul style={{ paddingLeft:18, display:'flex', flexDirection:'column', gap:5 }}>
            <li>Ubicación preferencial en la sala, lejos de distractores.</li>
            <li>Fraccionar tareas largas e incorporar pausas activas.</li>
            <li>Entregar instrucciones breves y destacar la acción a realizar.</li>
            <li>Considerar tiempo adicional en evaluaciones.</li>
            <li>Apoyo socioemocional y anticipación de cambios de rutina.</li>
          </ul>
          <div style={{ marginTop:24, paddingTop:14, borderTop:'1px solid #ddd', textAlign:'center', color:'#888', fontSize:10.5 }}>Documento confidencial · uso exclusivo del equipo psicoeducativo</div>
        </div>
        ) : (
          <div style={{ padding:'34px 30px', textAlign:'center', color:t.muted, fontSize:12.5, lineHeight:1.6 }}>Aún no hay un archivo de informe cargado para este estudiante.<br/>Usa “Seleccionar archivo…” para subir el informe del especialista.</div>
        )}
      </div>
    </div>
  );
}
function SectTitle({ t, children }){ return <div style={{ fontSize:12, fontWeight:800, color:t.ink, textTransform:'uppercase', letterSpacing:0.6, borderBottom:`2px solid ${t.soft}`, paddingBottom:5, marginBottom:11 }}>{children}</div>; }

// ─── Informe médico externo imprimible ──────────────────────────
function imprimirInformeMedico(est){
  const esc=(s)=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Informe Neurología · ${esc(est.nombre)}</title>
  <style>*{box-sizing:border-box} body{font-family:Georgia,'Times New Roman',serif;color:#2a2f45;margin:0;padding:48px 60px;line-height:1.6;font-size:13px}
  .c{text-align:center;border-bottom:2px solid #ddd;padding-bottom:16px;margin-bottom:22px} .c .t{font-size:16px;font-weight:800;color:#1B1F3B} .c .s{font-size:11px;color:#888;margin-top:4px}
  h2{font-size:13px;color:#1B1F3B;margin:20px 0 6px} .row{display:flex;gap:8px;margin-bottom:4px} .row b{min-width:100px;color:#555}
  ul{padding-left:20px} li{margin-bottom:5px} .foot{margin-top:34px;padding-top:16px;border-top:1px solid #ddd;text-align:center;color:#888;font-size:10.5px}</style></head><body>
  <div class="c"><div class="t">CENTRO MÉDICO NEURODESARROLLO</div><div class="s">Dra. Carolina Méndez · Neuróloga infantil · RUT 12.345.678-9</div></div>
  <div style="font-weight:800;font-size:14px;color:#1B1F3B;margin-bottom:12px">INFORME DE EVALUACIÓN NEUROLÓGICA</div>
  <div class="row"><b>Paciente:</b><span>${esc(est.nombre)}</span></div>
  <div class="row"><b>Edad:</b><span>${esc(est.edad||'—')}</span></div>
  <div class="row"><b>Curso:</b><span>${esc(est.curso||'—')}</span></div>
  <div class="row"><b>Fecha:</b><span>10 de junio de 2026</span></div>
  <div class="row"><b>Motivo:</b><span>Evaluación por dificultades atencionales</span></div>
  <h2>DIAGNÓSTICO</h2><p>${esc(est.diag||'—')}. Se observa adecuado desarrollo cognitivo general, con dificultades específicas en atención sostenida y autorregulación.</p>
  <h2>SUGERENCIAS PARA EL ESTABLECIMIENTO</h2>
  <ul><li>Ubicación preferencial en la sala, lejos de distractores.</li><li>Fraccionar tareas largas e incorporar pausas activas.</li><li>Entregar instrucciones breves y destacar la acción a realizar.</li><li>Considerar tiempo adicional en evaluaciones.</li><li>Apoyo socioemocional y anticipación de cambios de rutina.</li></ul>
  <div class="foot">Documento confidencial · uso exclusivo del equipo psicoeducativo</div>
  <script>window.onload=function(){setTimeout(function(){window.print();},400);};<\/script>
  </body></html>`;
  const w=window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); }
}

// ─── Expediente completo del estudiante (portabilidad) ──────────
function imprimirExpediente(est, revisiones){
  const esc=(s)=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const hoy=new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'long',year:'numeric'});
  const mias=(revisiones||[]).filter(r=>r.estId===est.id);
  const docFila=(icono,nombre,tipo,estado,fecha)=>`<tr><td style="width:26px;text-align:center">${icono}</td><td><b>${esc(nombre)}</b><br><span class="sub">${esc(tipo)}</span></td><td style="text-align:center"><span class="badge">${esc(estado)}</span></td><td style="text-align:right;color:#777;font-size:10px">${esc(fecha||'')}</td></tr>`;
  const filas=[];
  filas.push(docFila('<span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#6B6F92"></span>','Informe del especialista externo','Documento de origen · del apoderado','Recibido','10 jun 2026'));
  const CATNOM={ PAI:['Plan de Apoyo Individual','Acompañamiento'], PACI:['Plan de Adecuación Curricular Individual','Adecuación curricular'], PAEC:['Plan de Adecuación Evaluativa','Adecuación evaluativa'], PSM:['Plan de Salud Mental','Salud mental'] };
  ['PAI','PACI','PAEC','PSM'].forEach(pid=>{
    const r=mias.find(x=>x.planId===pid); const nm=CATNOM[pid];
    if(r){ const est=r.estado==='archivado'?'Firmado y archivado':r.estado==='firmado'?'Firmado por apoderado':r.estado==='en_revision'?'En revisión':r.estado==='cambios'?'Cambios solicitados':'Borrador';
      filas.push(docFila('<span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#2C7A6B"></span>',nm[0],nm[1]+(r.folio?' · Folio '+r.folio:''),est,r.fechaFirma||'')); }
  });
  const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Expediente · ${esc(est.nombre)}</title>
  <style>
    *{box-sizing:border-box} body{font-family:'Segoe UI',Arial,sans-serif;color:#22303B;margin:0;padding:0}
    .head{background:#2C7A6B;color:#fff;padding:26px 40px;border-bottom:5px solid #E8B54A}
    .head .col{font-size:11px;letter-spacing:2px;opacity:.85;text-transform:uppercase}
    .head h1{font-family:Georgia,serif;font-size:24px;margin:6px 0 2px}
    .head .sub{font-size:12px;opacity:.9}
    .wrap{padding:30px 40px}
    .id{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;background:#F2F8F6;border:1px solid #D6E8E2;border-radius:12px;padding:16px 20px;margin-bottom:22px}
    .id div span{font-size:9.5px;font-weight:700;color:#5B7A72;text-transform:uppercase;letter-spacing:.5px;display:block}
    .id div b{font-size:13px;color:#22303B}
    h2{font-size:13px;color:#2C7A6B;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #E8EFEC;padding-bottom:6px;margin:0 0 12px}
    table{width:100%;border-collapse:collapse} td{padding:10px 8px;border-bottom:1px solid #EDF1EF;font-size:12px;vertical-align:top}
    .sub{color:#7A8A85;font-size:10px}
    .badge{background:#EAF3F0;color:#2C7A6B;font-size:10px;font-weight:700;padding:2px 10px;border-radius:99px;white-space:nowrap}
    .note{margin-top:26px;background:#FBF6EA;border:1px solid #EAD8A8;border-radius:12px;padding:14px 18px;font-size:11px;color:#7A5E22;line-height:1.5}
    .tr{padding-left:4px} .tr-item{display:flex;gap:11px;padding-bottom:12px;position:relative}
    .tr-dot{width:11px;height:11px;border-radius:50%;flex-shrink:0;margin-top:4px}
    .tr-t{font-size:12px;font-weight:700;color:#22303B} .tr-yr{font-size:9.5px;font-weight:800;padding:1px 7px;border-radius:99px;margin-right:5px}
    .tr-d{font-size:10.5px;color:#7A8A85;margin-top:2px;line-height:1.4}
    .foot{margin-top:24px;text-align:center;color:#98A6A1;font-size:10px}
    .anx{page-break-inside:avoid;margin-bottom:20px} .doc-h{font-family:Georgia,serif;font-size:16px;color:#2C7A6B;margin:16px 0 3px} .doc-meta{font-size:10.5px;color:#7A8A85;margin-bottom:8px}
    .agt{font-size:11px;font-weight:800;color:#2C7A6B;text-transform:uppercase;letter-spacing:.5px;margin:12px 0 5px} .anx ul{margin:0 0 8px;padding-left:18px} .anx li{font-size:12px;margin-bottom:3px} .anx p{font-size:12px;line-height:1.5;margin:0 0 8px} .ag{margin-bottom:8px} .empty{font-size:11px;color:#98A6A1;font-style:italic}
  </style></head><body>
  <div class="head"><div class="col">Colegio Mayor Peñalolén · Equipo Psicoeducativo</div><h1>Expediente del estudiante</h1><div class="sub">Carpeta completa de documentos · generado el ${hoy}</div></div>
  <div class="wrap">
    <div class="id">
      <div><span>Nombre</span><b>${esc(est.nombre)}</b></div>
      <div><span>Curso</span><b>${esc(est.curso)}</b></div>
      <div><span>Edad</span><b>${esc(est.edad||'—')}</b></div>
      <div><span>Diagnóstico</span><b>${esc(est.diag||'—')}</b></div>
      ${est.rut?`<div><span>RUT</span><b>${esc(est.rut)}</b></div>`:''}
      ${est.apoderado?`<div><span>Apoderado</span><b>${esc(est.apoderado)}</b></div>`:''}
    </div>
    <h2>Índice de documentos (${filas.length})</h2>
    <table>${filas.join('')}</table>
    ${(()=>{ const tr=(typeof TRAYECTORIA!=='undefined' && TRAYECTORIA[est.id])||[]; if(!tr.length) return ''; const KC={doc:'#6B6F92',diag:'#7A4FB0',plan:'#185FA5',hito:'#1E7A53',alerta:'#B23A24'};
      const items=tr.map(h=>`<div class="tr-item"><span class="tr-dot" style="background:${KC[h.k]||'#2C7A6B'}"></span><div><div class="tr-t"><span class="tr-yr" style="background:${(KC[h.k]||'#2C7A6B')}22;color:${KC[h.k]||'#2C7A6B'}">${esc(h.a)}</span> ${esc(h.t)}</div><div class="tr-d">${esc(h.d)}</div></div></div>`).join('');
      return `<h2 style="margin-top:26px">Trayectoria del estudiante</h2><div class="tr">${items}</div>`; })()}
    <div class="note"><b>Portabilidad de datos.</b> Este expediente reúne toda la documentación del estudiante en un solo archivo. El colegio es dueño de sus datos y puede exportarlos en cualquier momento — sin candados ni dependencia del proveedor.</div>
    ${(()=>{ const plan=(typeof ptaLoad==='function' && ptaLoad()[est.id])||{}; const rows=[]; (typeof asignaturasFor==='function'?asignaturasFor(est.curso):[]).forEach(asig=>{ const evs=(plan[asig]||[]).slice().sort((a,b)=>(a.fecha||'').localeCompare(b.fecha||'')); if(evs.length){ const cont=evs.map(e=>{ const f=e.fecha?new Date(e.fecha+'T00:00').toLocaleDateString('es-CL',{day:'2-digit',month:'short'}):'—'; return `<div style="margin-bottom:3px"><b>${esc(e.tipo)}</b> ${esc(e.desc)} <span class="sub">· ${f} · ${esc(e.estado)}${e.profesor?' · '+esc(e.profesor):''}</span></div>`; }).join(''); rows.push(`<tr><td style="width:30%;font-weight:700">${esc(asig)}</td><td>${cont}</td></tr>`); } });
      if(!rows.length) return ''; return `<h2 style="margin-top:26px">Plan de trabajo académico</h2><table>${rows.join('')}</table>`; })()}
    ${(()=>{
      const setFor=(pid)=> pid==='PAEC'?ADEC_EVAL:pid==='PSM'?ADEC_PSM:ADEC_ACCESO;
      const adecHTML=(set,mk)=> set.map((g,gi)=>{ const its=g.items.map((it,ii)=> mk[gi+'-'+ii]?`<li>${esc(it)}</li>`:'').filter(Boolean).join(''); return its?`<div class="ag"><div class="agt">${esc(g.tipo)}</div><ul>${its}</ul></div>`:''; }).filter(Boolean).join('') || '<div class="empty">Sin adecuaciones marcadas.</div>';
      const secs=[];
      secs.push(`<div class="anx"><div class="doc-h">Informe del especialista externo</div><div class="doc-meta">Documento de origen · entregado por el apoderado · 10 jun 2026</div><p><b>Diagnóstico:</b> ${esc(est.diag||'—')}. Se observa adecuado desarrollo cognitivo general, con dificultades específicas acordes al diagnóstico.</p><div class="agt">Sugerencias para el establecimiento</div><ul><li>Ubicación preferencial en la sala, lejos de distractores.</li><li>Fraccionar tareas largas e incorporar pausas activas.</li><li>Entregar instrucciones breves y destacar la acción a realizar.</li><li>Considerar tiempo adicional en evaluaciones.</li><li>Apoyo socioemocional y anticipación de cambios de rutina.</li></ul></div>`);
      ['PAI','PACI','PAEC','PSM'].forEach(pid=>{ const r=mias.find(x=>x.planId===pid); if(!r) return; const nm=CATNOM[pid];
        const firmas=(r.firmasInternas||[]).map(f=>`<li>${esc(f.rol)} — ${f.firma?('firmado '+esc(f.fecha||'')):'pendiente'}</li>`).join('');
        secs.push(`<div class="anx"><div class="doc-h">${esc(nm[0])}</div><div class="doc-meta">${esc(nm[1])}${r.folio?' · Folio '+esc(r.folio):''}${r.fechaFirma?' · firmado por apoderado '+esc(r.fechaFirma):''}</div><div class="agt">Adecuaciones</div>${adecHTML(setFor(pid), r.marcadas||{})}${r.obs?`<div class="agt">Observaciones</div><p>${esc(r.obs)}</p>`:''}${firmas?`<div class="agt">Firmas del equipo</div><ul>${firmas}</ul>`:''}</div>`);
      });
      return `<h2 style="page-break-before:always">Anexo · documentos completos</h2>`+secs.join('');
    })()}
    <div class="foot">Documento confidencial · uso exclusivo del establecimiento · App Psicoeducativa</div>
  </div>
  <script>window.onload=function(){setTimeout(function(){window.print();},400);};<\/script>
  </body></html>`;
  const w=window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); }
}

// ─── Exportación de todos los expedientes del colegio (portabilidad) ──
function imprimirExportColegio(){
  const esc=(s)=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const hoy=new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'long',year:'numeric'});
  const porCurso={}; ESTUDIANTES.forEach(e=>{ (porCurso[e.curso]=porCurso[e.curso]||[]).push(e); });
  const bloques=Object.keys(porCurso).sort().map(c=>{
    const filas=porCurso[c].map(e=>`<tr><td><b>${esc(e.nombre)}</b></td><td>${esc(e.diag||'—')}</td><td style="text-align:center">${esc(e.plan||'—')}</td><td style="text-align:center"><span class="badge">${e.estado==='vigente'?'Gestionado':e.estado==='borrador'?'En elaboración':'Pendiente'}</span></td></tr>`).join('');
    return `<div class="curso"><h3>Curso ${esc(c)} · ${porCurso[c].length} estudiante(s)</h3><table><tr class="th"><td>Estudiante</td><td>Diagnóstico</td><td style="text-align:center">Plan</td><td style="text-align:center">Estado</td></tr>${filas}</table></div>`;
  }).join('');
  const total=ESTUDIANTES.length;
  const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Exportación de expedientes · Colegio Mayor Peñalolén</title>
  <style>
    *{box-sizing:border-box} body{font-family:'Segoe UI',Arial,sans-serif;color:#22303B;margin:0}
    .head{background:#2C7A6B;color:#fff;padding:26px 40px;border-bottom:5px solid #E8B54A}
    .head .col{font-size:11px;letter-spacing:2px;opacity:.85;text-transform:uppercase}
    .head h1{font-family:Georgia,serif;font-size:24px;margin:6px 0 2px}
    .head .sub{font-size:12px;opacity:.9}
    .wrap{padding:30px 40px}
    .kpi{display:flex;gap:14px;margin-bottom:24px}
    .kpi div{flex:1;background:#F2F8F6;border:1px solid #D6E8E2;border-radius:12px;padding:14px 16px;text-align:center}
    .kpi .n{font-size:26px;font-weight:800;color:#2C7A6B} .kpi .l{font-size:10.5px;color:#5B7A72}
    .curso{margin-bottom:20px;break-inside:avoid} h3{font-size:13px;color:#2C7A6B;margin:0 0 8px}
    table{width:100%;border-collapse:collapse} td{padding:8px;border-bottom:1px solid #EDF1EF;font-size:11.5px}
    .th td{font-weight:700;color:#5B7A72;font-size:10px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #E8EFEC}
    .badge{background:#EAF3F0;color:#2C7A6B;font-size:9.5px;font-weight:700;padding:2px 9px;border-radius:99px}
    .note{margin-top:10px;background:#FBF6EA;border:1px solid #EAD8A8;border-radius:12px;padding:14px 18px;font-size:11px;color:#7A5E22;line-height:1.5}
    .foot{margin-top:24px;text-align:center;color:#98A6A1;font-size:10px}
  </style></head><body>
  <div class="head"><div class="col">Colegio Mayor Peñalolén · Equipo Psicoeducativo</div><h1>Exportación de expedientes del colegio</h1><div class="sub">Todos los estudiantes con NEE, organizados por curso · generado el ${hoy}</div></div>
  <div class="wrap">
    <div class="kpi"><div><div class="n">${total}</div><div class="l">Estudiantes con expediente</div></div><div><div class="n">${Object.keys(porCurso).length}</div><div class="l">Cursos</div></div><div><div class="n">4</div><div class="l">Tipos de plan</div></div></div>
    ${bloques}
    <div class="note"><b>Garantía de portabilidad.</b> Esta exportación entrega la información de todos los expedientes del colegio organizada por curso y estudiante. Sus datos le pertenecen: puede llevárselos completos cuando lo decida, sin quedar atado al proveedor.</div>
    <div class="foot">Documento confidencial · uso exclusivo del establecimiento · App Psicoeducativa</div>
  </div>
  <script>window.onload=function(){setTimeout(function(){window.print();},400);};<\/script>
  </body></html>`;
  const w=window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); }
}

// ─── Informe "Apoyos al estudiante" (profesores de asignatura) ──
function imprimirApoyos(est, curso, tutor, apoyos){
  const esc=(s)=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const filas = (apoyos||[]).map(a=>`<tr>
    <td class="asg">${esc(a.asignatura)}</td>
    <td><div class="ap">${esc(a.apoyos).replace(/\n/g,'<br>')}</div><div class="pr">${esc(a.profesor||'—')}${a.correo?` · <span style="color:#2E8A95">${esc(a.correo)}</span>`:''}</div></td>
  </tr>`).join('');
  const docentes = (apoyos||[]).filter(a=>a.profesor||a.correo).map(a=>`<span>${esc(a.profesor||'—')}${a.correo?` (${esc(a.correo)})`:''} · ${esc(a.asignatura)}</span>`).join('');
  const logo = location.origin+location.pathname.replace(/[^/]*$/,'')+'logo-blanco.png';
  const html=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Apoyos al estudiante · ${esc(est.nombre)}</title>
  <style>
    @page{ size:A4; margin:30mm 14mm 16mm; }
    *{ box-sizing:border-box; } body{ font-family:'Segoe UI',Arial,sans-serif; color:#1c1c1c; font-size:10.5px; line-height:1.45; margin:0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .runhead{ position:fixed; top:0; left:0; right:0; height:24mm; background:#4FC0CB; display:flex; align-items:center; padding:0 18px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .runhead img{ height:74px; }
    .runhead .ttl{ margin-left:auto; color:#fff; font-style:italic; font-weight:800; font-size:14px; text-align:right; }
    h1{ font-size:15px; text-align:center; color:#2E8A95; margin:4px 0 14px; }
    h2{ font-size:11px; background:#4FC0CB; color:#fff; padding:5px 10px; margin:14px 0 7px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    table{ width:100%; border-collapse:collapse; }
    .idt td{ border:1px solid #b9c2d0; padding:5px 9px; } .idt td.k{ background:#eef2f8; font-weight:700; width:33%; }
    .adt th{ background:#4FC0CB; color:#fff; border:1px solid #4FC0CB; padding:6px; font-size:9.5px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .adt td{ border:1px solid #b9c2d0; padding:7px 9px; vertical-align:top; }
    .adt td.asg{ background:#eef2f8; font-weight:700; width:24%; }
    .ap{ white-space:pre-line; } .pr{ font-size:9px; color:#666; margin-top:5px; font-style:italic; }
    .ft{ margin-top:24px; text-align:center; font-size:8.5px; color:#999; border-top:1px solid #ddd; padding-top:8px; }
  </style></head><body>
  <div class="runhead"><img src="${logo}" onerror="this.style.display='none'"><div class="ttl">Plan de Apoyo a las NEE · Colegio Mayor Peñalolén</div></div>
  <div style="height:28mm"></div>
  <h1>APOYOS AL ESTUDIANTE</h1>
  <h2>IDENTIFICACIÓN</h2>
  <table class="idt"><tbody>
    <tr><td class="k">Nombre del estudiante</td><td>${esc(est.nombre)}</td></tr>
    <tr><td class="k">Curso</td><td>${esc(curso)}</td></tr>
    <tr><td class="k">Profesor(a) Tutor(a)</td><td>${esc(tutor)}</td></tr>
    <tr><td class="k">Fecha</td><td>${new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'long',year:'numeric'})}</td></tr>
  </tbody></table>
  <h2>APOYOS ENTREGADOS POR ASIGNATURA</h2>
  <table class="adt"><thead><tr><th style="width:24%">Asignatura</th><th>Apoyos entregados · Profesor(a) responsable</th></tr></thead><tbody>${filas||'<tr><td colspan="2">Sin apoyos registrados.</td></tr>'}</tbody></table>
  ${docentes?`<h2>PROFESORES DE ASIGNATURA</h2><div style="font-size:10px;line-height:1.7">${docentes.replace(/<\/span>/g,'</span><br>')}</div>`:''}
  <div class="ft">Documento oficial · Colegio Mayor Peñalolén · Generado por App Psicoeducativa</div>
  <script>window.onload=function(){setTimeout(function(){window.print();},400);};<\/script>
  </body></html>`;
  const w=window.open('','_blank'); w.document.write(html); w.document.close();
}

// ─── Genera el documento oficial del colegio y lo abre para imprimir / PDF ──
function imprimirOficial(plan, est, marcadas, adecSet, fechaElab, resp, director, equipo, obs, rev, ocultarFecha){
  resp = resp || {};
  if(Object.keys(resp).length===0 && rev && rev.resp) resp = rev.resp;
  // datos editables del estudiante (los completa el equipo; se comparten a la nube)
  const _dd = (lsGet('psico_datos_v1',{})[est.id]) || {};
  const _nacimiento = _dd.nacimiento || '______________';
  const _edad = _dd.edad || est.edad || '';
  const _diag = _dd.diag || est.diag || '';
  if(!director && _dd.director) director = _dd.director;
  const _hoy = new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'short',year:'numeric'});
  const _elab = (fechaElab && fechaElab!=='17 jun 2026') ? fechaElab : _hoy;
  const _recInforme = ((lsGet('psico_informe_v1',{})[est.id]||{}).fecha) || _elab;
  const equipoRoles=['Profesor/a Tutor/a','Psicólogo/a','Educador/a Diferencial','Terapeuta Ocupacional','Psicólogo/a de Convivencia'];
  const equipoSel=(equipo&&Object.keys(equipo).some(k=>equipo[k]))?equipoRoles.filter(r=>equipo[r]):equipoRoles;
  const esc=(s)=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  // Sección PACI: adecuaciones en los objetivos de aprendizaje, por asignatura
  function pacObjetivosHTML(){
    const subj = PACI_ASIGNATURAS.map(a=>{
      const grupos = [
        PACI_TIPOS_COMUNES[0],
        { g:'Priorización de OA y contenidos', items:a.prioriza },
        PACI_TIPOS_COMUNES[1], PACI_TIPOS_COMUNES[2], PACI_TIPOS_COMUNES[3],
      ];
      const cuerpo = grupos.map(gr=>`<div class="og"><div class="ogt">${esc(gr.g)}</div>${gr.items.map(it=>`<div class="it"><span class="bx"></span> ${esc(it)}</div>`).join('')}</div>`).join('');
      return `<tr>
        <td class="asg">${esc(a.nombre)}</td>
        <td><div class="ofld">Objetivo a adecuar:</div><div class="ln"></div><div class="ofld">Objetivo adecuado:</div><div class="ln"></div><div class="ofld">Indicador de logro:</div><div class="ln"></div></td>
        <td class="estr">${cuerpo}</td>
      </tr>`;
    }).join('');
    return `<h2>ADECUACIONES CURRICULARES EN LOS OBJETIVOS DE APRENDIZAJE</h2>
    <table class="adt pac"><thead><tr><th style="width:16%">Asignatura</th><th style="width:34%">Objetivos / Indicador de logro</th><th>Tipo de adecuación y estrategias</th></tr></thead><tbody>${subj}</tbody></table>`;
  }
  const esPAEC = plan.id==='PAEC';
  const esPACI = plan.id==='PACI';
  const esPSM = plan.id==='PSM';
  const respCols = (typeof RESPONSABLES!=='undefined') ? RESPONSABLES : ['P. de asignatura','P. diferencial','P. tutor','T. ocupacional','Psicóloga'];
  // filas de adecuaciones con columna de Responsables (casillas)
  const adecHTML = adecSet.map((g,gi)=>`
    <tr>
      <td class="tipo">${esc(g.tipo)}</td>
      <td>${g.items.map((it,ii)=>{ const on = marcadas[gi+'-'+ii]; return `<div class="it">${on?'<span class="bx on">&#10003;</span>':'<span class="bx"></span>'} ${esc(it)}</div>`; }).join('')}</td>
      <td class="resp">${respCols.map((r,ri)=>{ const on=resp[gi+'-'+ri]; return `<div class="it">${on?'<span class="bx on">&#10003;</span>':'<span class="bx"></span>'} ${esc(r)}</div>`; }).join('')}</td>
    </tr>`).join('');
  const idItems=[['Nombre',est.nombre||(rev&&rev.estNombre)||''],['Fecha de nacimiento',_nacimiento],['Edad cronológica',_edad],['Curso',est.curso||(rev&&rev.curso)||''],['Establecimiento','Colegio Mayor Peñalolén'],['Director/a de Ciclo',director||'______________'],['Diagnóstico',_diag],['Fecha de elaboración',_elab]];
  const tituloAdec = esPAEC ? 'ADECUACIONES EVALUATIVAS' : 'ADECUACIONES CURRICULARES DE ACCESO';
  const firmasBase = esPSM
    ? ['Apoderado(a)','Profesor(a) Tutor(a)','Educador(a) Diferencial','Psicóloga','Terapeuta Ocupacional','Director(a) de Ciclo']
    : ['Apoderado(a)','Profesor(a) Tutor(a)','Educador(a) Diferencial','Terapeuta Ocupacional','Psicóloga','Encargado de Convivencia','Director(a) de Ciclo'];
  // solo aparecen el apoderado + los firmantes seleccionados
  const firmas = (rev && rev.firmantes && rev.firmantes.length)
    ? ['Apoderado(a)', ...rev.firmantes]
    : firmasBase;
  const solApo = rev && rev.solicitudApoderado;
  const obsBlock = ((obs && obs.trim()) || solApo) ? `
  <h2>OBSERVACIONES</h2>
  ${(obs && obs.trim()) ? `<div class="obs"><b>Observaciones del equipo:</b><br>${esc(obs).replace(/\n/g,'<br>')}</div>` : ''}
  ${solApo ? `<div class="obs" style="margin-top:6px"><b>Solicitud del apoderado (incorporada):</b><br>${esc(solApo).replace(/\n/g,'<br>')}</div>` : ''}` : '';
  const cierre = (esPAEC || esPSM) ? '' : `
  <h2>OBSERVACIONES</h2>
  <div class="obs"><b>Observaciones del equipo:</b><br>${esc(obs||'').replace(/\n/g,'<br>')||'&nbsp;'}</div>
  ${ (rev && rev.solicitudApoderado) ? `<div class="obs" style="margin-top:6px"><b>Solicitud del apoderado (incorporada):</b><br>${esc(rev.solicitudApoderado).replace(/\n/g,'<br>')}</div>` : '' }
  ${esPACI ? pacObjetivosHTML() : ''}
  <h2>TEMPORALIZACIÓN DE APLICACIÓN DE LAS ADECUACIONES DE ACCESO</h2>
  <div class="inl"><span class="bx"></span> Semestral &nbsp;&nbsp; <span class="bx"></span> Mensual &nbsp;&nbsp; <span class="bx"></span> Otro: ____________</div>
  <h2>CRITERIOS DE EVALUACIÓN Y PROMOCIÓN</h2>
  <p class="p">Criterios y orientaciones generales para la evaluación de los logros de aprendizaje y para promocionar al estudiante de curso o nivel educativo.</p>
  <ul class="ul"><li>Decreto de evaluación, calificación y promoción (Decreto 67/2018).</li><li>Diversificación de enseñanza (Decreto 83).</li><li>Ley TEA N°21.545, Circular N°586 (aplica solo para diagnóstico Trastorno del Espectro Autista).</li><li>Reglamento Interno de Evaluación.</li></ul>
  <h2>SEGUIMIENTO</h2>
  <ul class="ul"><li>Análisis de las medidas y acciones de apoyo implementadas y sus efectos. Revisión de las N.E.E. establecidas y redefinición de las decisiones adoptadas si es necesario.</li><li>Observación en aula: identificar los logros y desafíos.</li><li>Revisión de las estrategias de intervención a través del trabajo con docentes de asignatura y equipo de ciclo.</li><li>Entrevistas con apoderados para la retroalimentación correspondiente.</li></ul>`;
  const html=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${esc(plan.full)} · ${esc(est.nombre)}</title>
  <style>
    @page{ size:A4; margin:30mm 14mm 16mm; }
    *{ box-sizing:border-box; } body{ font-family:'Segoe UI',Arial,sans-serif; color:#1c1c1c; font-size:10.5px; line-height:1.45; margin:0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .runhead{ position:fixed; top:0; left:0; right:0; height:24mm; background:#4FC0CB; display:flex; align-items:center; padding:0 18px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .runhead img{ height:74px; }
    .runhead .ttl{ margin-left:auto; color:#fff; font-style:italic; font-weight:800; font-size:14px; letter-spacing:0.3px; text-align:right; }
    h1{ font-size:14px; text-align:center; color:#2E8A95; margin:4px 0 14px; }
    h2{ font-size:11px; background:#4FC0CB; color:#fff; padding:5px 10px; margin:14px 0 7px; letter-spacing:0.3px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    table{ width:100%; border-collapse:collapse; }
    .idt td{ border:1px solid #b9c2d0; padding:5px 9px; } .idt td.k{ background:#eef2f8; font-weight:700; width:33%; }
    .adt th{ background:#4FC0CB; color:#fff; border:1px solid #4FC0CB; padding:6px; font-size:9.5px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .adt td{ border:1px solid #b9c2d0; padding:6px 8px; vertical-align:top; }
    .adt td.tipo{ background:#eef2f8; font-weight:700; width:30%; } .adt td.resp{ width:20%; background:#fafbfd; }
    .pac td.asg{ background:#eef2f8; font-weight:700; vertical-align:top; } .pac td.estr{ font-size:9px; } .pac .og{ margin-bottom:6px; } .pac .ogt{ font-weight:700; color:#2E8A95; margin-bottom:2px; }
    .ofld{ font-weight:700; font-size:9px; margin-top:4px; } .ln{ border-bottom:1px solid #b9c2d0; height:13px; }
    .it{ margin-bottom:3px; display:flex; gap:5px; align-items:flex-start; }
    .bx{ display:inline-block; width:11px; height:11px; border:1px solid #555; border-radius:2px; flex-shrink:0; margin-top:1px; text-align:center; line-height:10px; font-size:9px; }
    .bx.on{ background:#2E8A95; color:#fff; border-color:#2E8A95; }
    .eq{ display:flex; flex-wrap:wrap; gap:7px; } .eq span{ border:1px solid #b9c2d0; border-radius:4px; padding:4px 12px; font-weight:600; }
    .obs{ border:1px solid #b9c2d0; min-height:46px; padding:7px 9px; overflow:visible; } .inl .bx{ vertical-align:middle; } .p{ margin:4px 0; } .ul{ margin:4px 0 4px 16px; } .ul li{ margin-bottom:3px; }
    .firmas{ margin-top:34px; display:flex; flex-wrap:wrap; gap:26px 40px; justify-content:space-between; }
    .firmas div{ width:28%; text-align:center; border-top:1px solid #555; padding-top:5px; font-size:9.5px; }
    .firmas .sig{ border-top:1px solid #1E7A53; position:relative; }
    .firmas .sig img{ position:absolute; bottom:100%; left:50%; transform:translateX(-50%); max-width:90%; max-height:46px; }
    .sigmeta{ font-size:7.5px; color:#1E7A53; margin-top:2px; line-height:1.25; }
    .ft{ margin-top:22px; text-align:center; font-size:8.5px; color:#888; border-top:1px solid #ddd; padding-top:7px; }
  </style></head><body>
  <div class="runhead"><img src="${location.origin+location.pathname.replace(/[^/]*$/,'')}logo-blanco.png" onerror="this.style.display='none'"><div class="ttl">Plan de Apoyo a las NEE · Colegio Mayor Peñalolén</div></div>
  <div style="height:28mm"></div>
  <h1>${esc(plan.full).toUpperCase()} (${esc(plan.nombre)})</h1>
  <h2>IDENTIFICACIÓN DEL ESTUDIANTE</h2>
  <table class="idt"><tbody>${idItems.map(([k,v])=>`<tr><td class="k">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
  <h2>EQUIPO RESPONSABLE</h2>
  <div class="eq">${equipoSel.map(r=>`<span>${esc(r)}</span>`).join('')}</div>
  <h2>ACTA DE CONOCIMIENTO – INFORME EXTERNO</h2>
  <table class="idt"><tbody>
    <tr><td class="k">Profesional externo</td><td>Según informe adjunto</td></tr>
    <tr><td class="k">Fecha de recepción del informe</td><td>${esc(_recInforme)}</td></tr>
    <tr><td class="k">Fecha de actualización del informe</td><td>______________</td></tr>
    <tr><td class="k">Sugerencias externas</td><td>Incorporadas en las adecuaciones del presente plan</td></tr>
    <tr><td class="k">Decisión equipo de ciclo</td><td>${esPSM ? 'Se ajustará el calendario de todas las asignaturas con la flexibilidad necesaria.' : 'Estrategias a aplicar por el cuerpo docente, según se detalla a continuación'}</td></tr>
  </tbody></table>
  <h2>${tituloAdec}</h2>
  <table class="adt"><thead><tr><th style="width:30%">Tipo</th><th>Estrategias metodológicas</th><th style="width:20%">Responsables</th></tr></thead><tbody>${adecHTML}</tbody></table>
  ${cierre}${(esPAEC||esPSM)?obsBlock:''}
  <h2>FIRMAS</h2>
  <div class="firmas">${firmas.map(f=>{
    const esApo = /Apoderado/.test(f);
    if(esApo && rev && rev.firma){
      return `<div class="sig"><img src="${rev.firma}" alt="firma"/>${esc(f)}<div class="sigmeta">Aprobado digitalmente<br>${esc(rev.fechaFirma||'')} · Folio ${esc(rev.folio||'')}</div></div>`;
    }
    const fi = rev && rev.firmasInternas && rev.firmasInternas.find(x=> f.indexOf(x.rol)>=0 || x.rol.indexOf(f)>=0);
    if(fi && fi.firma){
      return `<div class="sig"><img src="${fi.firma}" alt="firma"/>${esc(f)}${ocultarFecha?'':`<div class="sigmeta">Firmado digitalmente<br>${esc(fi.fecha||'')}</div>`}</div>`;
    }
    return `<div>${esc(f)}</div>`;
  }).join('')}</div>
  <div class="ft">Documento oficial · Colegio Mayor Peñalolén · Generado por App Psicoeducativa</div>
  <script>window.onload=function(){setTimeout(function(){window.print();},400);};</script>
  </body></html>`;
  const w=window.open('','_blank');
  if(w){ w.document.write(html); w.document.close(); }
}

// ════════════════ PROFESOR ══════════════════════════════════════
function ProfesorDashboard({ t }){
  const [curso,setCurso]=useState(null);   // null = grilla; si no, código tipo '5°B'
  const inf=useInforme();
  const { seg }=useSeguimiento();
  const extraProf=lsGet('psico_extra_v1',[]);
  const revisionesProf=lsGet('psico_revisiones_v1',[]);
  const rosterProf=[...ESTUDIANTES,...extraProf];
  const conApoyo=rosterProf.filter(e=>curso && normCurso(e.curso)===curso && enSeguimiento(e,inf.data,revisionesProf,seg));
  const neeCountProf={}; rosterProf.forEach(e=>{ if(enSeguimiento(e,inf.data,revisionesProf,seg)){ const c=normCurso(e.curso); neeCountProf[c]=(neeCountProf[c]||0)+1; } });
  const [open,setOpen]=useState(null);
  const [busca,setBusca]=useState('');
  const [filtroC,setFiltroC]=useState('');
  const [leidos,setLeidos]=useState(()=>lsGet('psico_lectura_v1',{}));        // {`estId::Asignatura`: fechaConfirmación} — compartido con Equipo/Gestión
  useEffect(()=>{ const h=()=>setLeidos(lsGet('psico_lectura_v1',{})); window.addEventListener('lect-change',h); window.addEventListener('storage',h); return ()=>{ window.removeEventListener('lect-change',h); window.removeEventListener('storage',h); }; },[]);
  const [confAsig,setConfAsig]=useState({});     // input de asignatura por estudiante
  const [equipoUpd,setEquipoUpd]=useState({});   // {estId:true} = el equipo actualizó los apoyos
  const confirmarLectura=(estId)=>{ const a=(confAsig[estId]||'').trim(); if(!a)return; const fecha=new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'short',year:'numeric'}); const map={...lsGet('psico_lectura_v1',{}), [estId+'::'+a]:fecha}; lsSet('psico_lectura_v1',map); setLeidos(map); window.dispatchEvent(new Event('lect-change')); setConfAsig(p=>({...p,[estId]:''})); };
  // apoyos por asignatura reportados por cada profesor: { [estId]: [{asignatura, profesor, correo, apoyos}] } — compartido con Gestión
  const [apoyosAsig,setApoyosAsig]=useState(()=>lsGet('psico_apoyos_v1',{}));
  useEffect(()=>{ lsSet('psico_apoyos_v1', apoyosAsig); },[apoyosAsig]);
  const [form,setForm]=useState({ asignatura:'', profesor:'', correo:'', apoyos:'' });
  const pta=usePTA();
  const [evForm,setEvForm]=useState({ asignatura:ASIGNATURAS_7[0], tipo:'Prueba', desc:'', fecha:'', profesor:'' });
  const addEval=(estId)=>{ if(!evForm.desc.trim()) return; pta.add(estId, evForm.asignatura, { tipo:evForm.tipo, desc:evForm.desc.trim(), fecha:evForm.fecha, origen:'profesor', profesor:(evForm.profesor||'').trim()||'Profesor' }); setEvForm(f=>({ ...f, desc:'', fecha:'' })); };
  const tutorNombre='María Paz Herrera';
  const addApoyo=(estId)=>{
    if(!form.asignatura.trim()||!form.apoyos.trim()) return;
    setApoyosAsig(p=>({ ...p, [estId]: [...(p[estId]||[]), { ...form }] }));
    setForm({ asignatura:'', profesor:'', correo:'', apoyos:'' });
  };
  const delApoyo=(estId,idx)=> setApoyosAsig(p=>({ ...p, [estId]: (p[estId]||[]).filter((_,i)=>i!==idx) }));

  const SINTESIS={ e1:['Anticipar cambios de rutina con apoyo visual','Tiempo adicional en evaluaciones','Uso de pictogramas en instrucciones'],
    e2:['Ubicación estratégica en la sala','Fraccionar tareas largas','Pausas activas cada 20 min'],
    e3:['Contención emocional y técnicas de relajación','Flexibilidad de plazos','Acceso a sala de calma'],
    e5:['Material concreto para contenidos abstractos','Apoyo de educadora diferencial','Evaluación diferenciada'] };

  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'16px 16px 50px' }} className="fade">
      {!curso ? (
        <div className="fade">
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:4 }}>Selecciona un curso</div>
          <div style={{ fontSize:11, color:t.muted, marginBottom:12 }}>Todos los profesores pueden consultar cualquier curso. El punto indica estudiantes con apoyo.</div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar estudiante por nombre o diagnóstico…" style={{ width:'100%', padding:'10px 13px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:12.5, outline:'none', marginBottom:12 }} />
          {busca.trim() ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {rosterProf.filter(e=> enSeguimiento(e,inf.data,revisionesProf,seg) && (e.nombre+' '+(e.diag||'')).toLowerCase().includes(busca.toLowerCase())).map(e=>(
                <button key={e.id} onClick={()=>{ setCurso(normCurso(e.curso)); setOpen(e.id); setBusca(''); }} style={{ textAlign:'left', cursor:'pointer', background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'12px 14px', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:11, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:t.primaryDark, fontFamily:t.display, flexShrink:0 }}>{e.nombre.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
                  <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13, fontWeight:700, color:t.ink }}>{e.nombre}</div><div style={{ fontSize:11, color:t.muted, marginTop:1 }}>{(()=>{ const d=lsGet('psico_datos_v1',{})[e.id]||{}; const diag=d.diag||e.diag||''; return e.curso+(diag&&diag!=='—'?' · '+diag:''); })()}</div></div>
                </button>
              ))}
              {rosterProf.filter(e=> enSeguimiento(e,inf.data,revisionesProf,seg) && (e.nombre+' '+(e.diag||'')).toLowerCase().includes(busca.toLowerCase())).length===0 && <div style={{ textAlign:'center', color:t.muted, fontSize:12, padding:20 }}>Sin resultados.</div>}
            </div>
          ) : (
          <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'14px 12px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'34px repeat(5,1fr)', gap:6, alignItems:'center' }}>
              <div></div>
              {CURSO_GRID.letras.map(l=><div key={l} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:t.muted }}>{l}</div>)}
              {CURSO_GRID.niveles.map(n=>(
                <React.Fragment key={n}>
                  <div style={{ fontSize:10, fontWeight:700, color:t.ink, textAlign:'right', paddingRight:4 }}>{n}</div>
                  {CURSO_GRID.letras.map(l=>{
                    if(l==='E' && (n==='III°'||n==='IV°')) return <div key={l}></div>;
                    const code=n+l; const nee=neeCountProf[code]||0;
                    return (
                      <button key={l} onClick={()=>{ setCurso(code); setOpen(null); }} style={{ position:'relative', height:38, borderRadius:9, cursor:'pointer', fontSize:11, fontWeight:700,
                        border:`1px solid ${nee?t.primary:t.border}`, background:nee?t.primary:t.card, color:nee?'#fff':t.muted, transition:'all .15s' }}>
                        {code}
                        {nee>0 && <span style={{ position:'absolute', top:-5, right:-5, width:16, height:16, borderRadius:'50%', background:t.accent, color:t.ink, fontSize:9.5, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${t.bg}` }}>{nee}</span>}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
          )}
        </div>
      ) : (
        <React.Fragment>
      <button onClick={()=>{ setCurso(null); setOpen(null); }} style={{ background:'none', border:'none', color:t.muted, fontSize:12.5, cursor:'pointer', marginBottom:12, fontWeight:600 }}>← Volver a cursos</button>
      <div style={{ background:t.card, border:`1px solid ${t.accent}44`, borderLeft:`4px solid ${t.accent}`, borderRadius:t.radius, padding:'12px 15px', marginBottom:14, fontSize:11.5, color:t.muted, lineHeight:1.5 }}>
        Ves la <b style={{ color:t.ink }}>síntesis de apoyos y adecuaciones</b> de tus estudiantes. Por confidencialidad, los informes y planes completos solo los gestiona el equipo psicoeducativo.
      </div>

      <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:10 }}>Estudiantes de {curso} con apoyo <span style={{ color:t.muted, fontWeight:600 }}>· {conApoyo.length}</span></div>
      {conApoyo.length>4 && (
        <input value={filtroC} onChange={e=>setFiltroC(e.target.value)} placeholder="Filtrar en este curso por nombre o RUT…" style={{ width:'100%', padding:'9px 12px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:12.5, outline:'none', marginBottom:10, background:t.card, color:t.ink }} />
      )}
      {conApoyo.length===0 && <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:24, textAlign:'center', color:t.muted, fontSize:12.5 }}>No hay estudiantes con plan activo en este curso.</div>}
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {(()=>{ const q=filtroC.trim().toLowerCase(); const lista=[...conApoyo].sort((a,b)=>a.nombre.localeCompare(b.nombre,'es')).filter(e=> !q || (e.nombre+' '+(e.rut||'')).toLowerCase().includes(q)); if(conApoyo.length>0 && lista.length===0) return <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:20, textAlign:'center', color:t.muted, fontSize:12.5 }}>Sin resultados para “{filtroC}”.</div>; return lista.map(e=>(
          <div key={e.id} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, overflow:'hidden' }}>
            <button onClick={()=>setOpen(open===e.id?null:e.id)} style={{ width:'100%', textAlign:'left', cursor:'pointer', background:'none', border:'none', padding:'13px 15px', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:11, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:t.primaryDark, fontFamily:t.display, flexShrink:0 }}>{e.nombre.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
              <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13.5, fontWeight:700, color:t.ink }}>{e.nombre}</div><div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{(()=>{ const d=lsGet('psico_datos_v1',{})[e.id]||{}; const diag=d.diag||e.diag||''; return [e.rut, diag].filter(Boolean).join(' · ')||'—'; })()}</div></div>
              {(()=>{ const docs=(revisionesProf||[]).filter(r=>r.estId===e.id && (r.estado==='firmado'||r.estado==='archivado')); const nom=[...new Set(docs.map(r=>r.planNombre||r.planId))][0]; return nom ? <Chip t={t} label={nom} tone="soft" /> : null; })()}
              <span style={{ color:t.muted, fontSize:15, transform:open===e.id?'rotate(180deg)':'none', transition:'.2s', marginLeft:4 }}>⌄</span>
            </button>
            {open===e.id && (
              <div style={{ padding:'4px 15px 15px', borderTop:`1px solid ${t.border}` }} className="fade">
                {(()=>{
                  const docs=(revisionesProf||[]).filter(r=>r.estId===e.id && (r.estado==='firmado'||r.estado==='archivado'));
                  const docNoms=[...new Set(docs.map(r=>r.planNombre||r.planId))];
                  const aps=apoyosAsig[e.id]||[];
                  const plan=pta.data[e.id]||{}; let nEv=0; asignaturasFor(e.curso).forEach(a=>{ nEv+=(plan[a]||[]).length; });
                  return (
                    <div style={{ background:t.soft, border:`1px solid ${t.border}`, borderRadius:12, padding:'12px 14px', margin:'12px 0 4px' }}>
                      <div style={{ fontSize:10.5, fontWeight:800, color:t.primaryDark, textTransform:'uppercase', letterSpacing:0.5, marginBottom:9 }}>Ficha del estudiante</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
                        <div>
                          <div style={{ fontSize:10.5, color:t.muted, fontWeight:700, marginBottom:4 }}>Documentos vigentes</div>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                            {docNoms.length ? docNoms.map((d,i)=><span key={i} style={{ background:'#EAF3F0', color:'#1E7A53', fontSize:10.5, fontWeight:800, padding:'3px 9px', borderRadius:99 }}>{d}</span>) : <span style={{ fontSize:11, color:t.muted, fontStyle:'italic' }}>Sin planes vigentes aún</span>}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize:10.5, color:t.muted, fontWeight:700, marginBottom:5 }}>Apoyos por asignatura</div>
                          {aps.length ? (
                            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                              {aps.map((a,i)=>(
                                <div key={i} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:9, padding:'8px 11px' }}>
                                  <div style={{ fontSize:11.5, fontWeight:800, color:t.ink }}>{a.asignatura}</div>
                                  <div style={{ fontSize:11, color:t.ink, marginTop:2, whiteSpace:'pre-wrap', lineHeight:1.45 }}>{a.apoyos}</div>
                                </div>
                              ))}
                            </div>
                          ) : <span style={{ fontSize:11, color:t.muted, fontStyle:'italic' }}>Aún sin apoyos reportados por los profesores</span>}
                        </div>
                        <div>
                          <div style={{ fontSize:10.5, color:t.muted, fontWeight:700 }}>Evaluaciones programadas</div>
                          <div style={{ fontSize:15, fontWeight:800, color:t.ink }}>{nEv}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                <div style={{ fontSize:10.5, fontWeight:800, color:t.primaryDark, textTransform:'uppercase', letterSpacing:0.5, margin:'14px 0 8px' }}>Apoyos en el aula</div>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                  {(SINTESIS[e.id]||[]).map((s,i)=>(
                    <div key={i} style={{ display:'flex', gap:9, alignItems:'flex-start' }}>
                      <span style={{ width:18, height:18, borderRadius:6, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}><Icon k="check" c={t.primary} s={12} /></span>
                      <span style={{ fontSize:12, color:t.ink, lineHeight:1.4 }}>{s}</span>
                    </div>
                  ))}
                </div>
                {equipoUpd[e.id] && (
                  <div style={{ background:'#FBE6E2', border:'1px solid #E8B4AA', borderRadius:9, padding:'9px 12px', marginTop:10, fontSize:11, fontWeight:600, color:'#B23A24' }}>El equipo actualizó los apoyos. Las confirmaciones por asignatura deben renovarse.</div>
                )}
                <div style={{ fontSize:10.5, fontWeight:800, color:t.primaryDark, textTransform:'uppercase', letterSpacing:0.5, margin:'14px 0 7px' }}>Confirmación de lectura por asignatura</div>
                {Object.keys(leidos).filter(k=>k.startsWith(e.id+'::')&&leidos[k]).map(k=>(
                  <div key={k} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                    <span style={{ width:18, height:18, borderRadius:6, background:'#E2F3EC', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="check" c="#1E7A53" s={12} /></span>
                    <span style={{ fontSize:11.5, color:t.ink }}><b>{k.split('::')[1]}</b> · leído y aplicado · {leidos[k]}</span>
                  </div>
                ))}
                <div style={{ display:'flex', gap:7, marginTop:6 }}>
                  <input value={confAsig[e.id]||''} onChange={ev=>setConfAsig(p=>({...p,[e.id]:ev.target.value}))} placeholder="Tu asignatura (ej: Matemáticas)" style={{ flex:1, padding:'8px 11px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, outline:'none' }} />
                  <button onClick={()=>confirmarLectura(e.id)} style={{ background:'#1E7A53', color:'#fff', border:'none', borderRadius:8, padding:'8px 13px', fontSize:11, fontWeight:700, cursor:'pointer', flexShrink:0, whiteSpace:'nowrap' }}>✓ Confirmar</button>
                </div>
                <div style={{ fontSize:10.5, fontWeight:800, color:t.primaryDark, textTransform:'uppercase', letterSpacing:0.5, margin:'16px 0 8px' }}>Apoyos por asignatura</div>
                {(apoyosAsig[e.id]||[]).map((a,i)=>(
                  <div key={i} style={{ background:t.soft, borderRadius:10, padding:'9px 12px', marginBottom:7 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8 }}>
                      <span style={{ fontSize:12, fontWeight:800, color:t.ink }}>{a.asignatura}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:9.5, color:t.muted }}>{a.profesor}{a.correo?` · ${a.correo}`:''}</span>
                        <button onClick={()=>delApoyo(e.id,i)} title="Eliminar" style={{ background:'none', border:'none', cursor:'pointer', color:'#B23A24', fontSize:13, fontWeight:700, padding:0 }}>✕</button>
                      </span>
                    </div>
                    <div style={{ fontSize:11.5, color:t.ink, lineHeight:1.45, marginTop:3, whiteSpace:'pre-line' }}>{a.apoyos}</div>
                  </div>
                ))}
                <div style={{ background:t.card, border:`1px dashed ${t.border}`, borderRadius:10, padding:12, marginTop:4 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:t.ink, marginBottom:8 }}>Reportar apoyos de mi asignatura</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:7 }}>
                    <input value={form.asignatura} onChange={ev=>setForm(f=>({...f,asignatura:ev.target.value}))} placeholder="Asignatura *" style={{ padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, outline:'none' }} />
                    <input value={form.profesor} onChange={ev=>setForm(f=>({...f,profesor:ev.target.value}))} placeholder="Tu nombre" style={{ padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, outline:'none' }} />
                  </div>
                  <input value={form.correo} onChange={ev=>setForm(f=>({...f,correo:ev.target.value}))} placeholder="Tu correo" style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, outline:'none', marginBottom:7 }} />
                  <textarea value={form.apoyos} onChange={ev=>setForm(f=>({...f,apoyos:ev.target.value}))} rows={3} placeholder="Describe o enumera los apoyos que entregas en tu asignatura *" style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, resize:'vertical', outline:'none', fontFamily:'inherit', marginBottom:8 }} />
                  <button onClick={()=>addApoyo(e.id)} style={{ width:'100%', padding:9, background:t.primary, color:'#fff', border:'none', borderRadius:9, fontSize:12, fontWeight:700, cursor:'pointer' }}>＋ Agregar apoyo</button>
                </div>
                {(apoyosAsig[e.id]||[]).length>0 && (
                  <button onClick={()=>imprimirApoyos(e, curso, tutorNombre, apoyosAsig[e.id])} style={{ width:'100%', marginTop:9, padding:11, background:t.card, color:t.ink, border:`1px solid ${t.border}`, borderRadius:11, fontSize:12.5, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}><Icon k="download" c={t.ink} s={16} />Descargar informe "Apoyos al estudiante"</button>
                )}

                {/* Evaluaciones programadas (Plan de trabajo académico) */}
                <div style={{ fontSize:10.5, fontWeight:800, color:t.primaryDark, textTransform:'uppercase', letterSpacing:0.5, margin:'18px 0 4px' }}>Evaluaciones programadas</div>
                <div style={{ fontSize:10, color:t.muted, marginBottom:9, lineHeight:1.5 }}>Qué debe rendir este estudiante, por asignatura. Agrega las de <b>tu</b> asignatura; el equipo psicoeducativo las consolida.</div>
                {(()=>{ const plan=pta.data[e.id]||{}; const rows=[]; asignaturasFor(e.curso).forEach(asig=>(plan[asig]||[]).forEach(ev=>rows.push({...ev, asignatura:asig}))); rows.sort((a,b)=>(a.fecha||'9999').localeCompare(b.fecha||'9999'));
                  return rows.length ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:10 }}>
                      {rows.map(ev=>(
                        <div key={ev.id} style={{ display:'flex', alignItems:'flex-start', gap:8, background:t.soft, borderRadius:9, padding:'8px 11px' }}>
                          <span style={{ background:ptaTipoColor(ev.tipo), color:'#fff', fontSize:8.5, fontWeight:800, padding:'2px 7px', borderRadius:99, textTransform:'uppercase', letterSpacing:0.3, flexShrink:0, marginTop:1 }}>{ev.tipo}</span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:11.5, color:t.ink, lineHeight:1.4 }}><b style={{ fontWeight:700 }}>{ev.asignatura}</b> · {ev.desc}</div>
                            <div style={{ fontSize:9.5, color:t.muted, marginTop:1 }}>{ev.fecha ? new Date(ev.fecha+'T00:00').toLocaleDateString('es-CL',{day:'2-digit',month:'short'}) : 'Sin fecha'} · {ev.estado}{ev.origen==='profesor' && <span style={{ color:t.primary, fontWeight:700 }}> · {ev.profesor}</span>}</div>
                          </div>
                          {ev.origen==='profesor' && <button onClick={()=>pta.del(e.id,ev.asignatura,ev.id)} title="Eliminar" style={{ flexShrink:0, background:'none', border:'none', cursor:'pointer', color:'#B23A24', fontSize:12, fontWeight:700, padding:'0 2px' }}>✕</button>}
                        </div>
                      ))}
                    </div>
                  ) : <div style={{ fontSize:11, color:t.muted, fontStyle:'italic', marginBottom:10 }}>Aún no hay evaluaciones programadas.</div>;
                })()}
                <div style={{ background:t.card, border:`1px dashed ${t.border}`, borderRadius:10, padding:12 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:t.ink, marginBottom:8 }}>Agregar evaluación de mi asignatura</div>
                  <div style={{ display:'flex', gap:7, marginBottom:7, flexWrap:'wrap' }}>
                    <select value={evForm.asignatura} onChange={ev=>setEvForm(f=>({...f,asignatura:ev.target.value}))} style={{ flex:1, minWidth:150, padding:'8px 9px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11, background:t.card, color:t.ink, fontWeight:600 }}>{asignaturasFor(e.curso).map(x=><option key={x}>{x}</option>)}</select>
                    <select value={evForm.tipo} onChange={ev=>setEvForm(f=>({...f,tipo:ev.target.value}))} style={{ padding:'8px 9px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11, background:t.card, color:t.ink, fontWeight:600 }}>{PTA_TIPOS.map(x=><option key={x}>{x}</option>)}</select>
                  </div>
                  <input value={evForm.desc} onChange={ev=>setEvForm(f=>({...f,desc:ev.target.value}))} placeholder="¿Qué debe rendir? (ej: Prueba unidad 2)" style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, outline:'none', marginBottom:7 }} />
                  <div style={{ display:'flex', gap:7, marginBottom:8, flexWrap:'wrap' }}>
                    <input type="date" value={evForm.fecha} onChange={ev=>setEvForm(f=>({...f,fecha:ev.target.value}))} style={{ flex:1, minWidth:120, padding:'8px 9px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11, background:t.card, color:t.ink }} />
                    <input value={evForm.profesor} onChange={ev=>setEvForm(f=>({...f,profesor:ev.target.value}))} placeholder="Tu nombre" style={{ flex:1, minWidth:120, padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:11.5, outline:'none' }} />
                  </div>
                  <button onClick={()=>addEval(e.id)} style={{ width:'100%', padding:9, background:t.primary, color:'#fff', border:'none', borderRadius:9, fontSize:12, fontWeight:700, cursor:'pointer' }}>＋ Agregar evaluación</button>
                </div>
              </div>
            )}
          </div>
        )); })()}
      </div>
        </React.Fragment>
      )}
    </div>
  );
}

// ════════════════ APODERADO ═════════════════════════════════════
function ApoderadoDashboard({ t, onUpload, revisiones, aprobarFirmar, solicitarCambios }){
  const [phase,setPhase]=useState('idle'); // idle | uploading | done
  const [hist,setHist]=useState(()=> (typeof window!=='undefined'&&window.PSICO_PILOTO) ? [] : [{ doc:'Informe Fonoaudiología.pdf', fecha:'12 mar 2026', estado:'Procesado' }]);
  const [revisando,setRevisando]=useState(null); // documento en pantalla de revisión
  // Hijos vinculados: guardados en la CUENTA del apoderado (metadata) → disponibles en
  // cualquier dispositivo/navegador, y privados (no se comparten con otros apoderados).
  const apoKey = 'psico_apo_hijos_'+((window.PSICO_USER&&window.PSICO_USER.id)||'anon');
  const [hijos,setHijos]=useState(()=>{ const meta=(window.PSICO_USER&&window.PSICO_USER.hijos); if(Array.isArray(meta)&&meta.length) return meta; const v=lsGet(apoKey,null); return v!=null?v:[]; });
  useEffect(()=>{ lsSet(apoKey, hijos); if(window.PSICO_USER) window.PSICO_USER.hijos=hijos; const sb=window.PSICO_SB; if(sb){ try{ sb.auth.updateUser({ data:{ hijos } }); }catch(e){} } },[hijos]);
  const HIJOS = hijos;
  const rosterApo=[...ESTUDIANTES,...lsGet('psico_extra_v1',[])];
  const normRut=(s)=>String(s||'').replace(/[.\s]/g,'').toLowerCase();
  const maskRut=(r)=>{ const s=String(r||''); if(s.length<4) return '•••'; return '••.•••.'+s.replace(/[.\s]/g,'').slice(-4,-1)+'-'+s.replace(/[.\s]/g,'').slice(-1); };
  const [rutBusca,setRutBusca]=useState('');
  const [vinculando,setVinculando]=useState(false);
  const [pin,setPin]=useState('');
  const [candidato,setCandidato]=useState(null); // estudiante elegido, esperando código
  const [codigoInput,setCodigoInput]=useState('');
  const [codigoErr,setCodigoErr]=useState(false);
  const confirmarVinculo=()=>{ if(!candidato) return; const ok=String(codigoInput||'').trim().toUpperCase()===codigoVinculacion(candidato); if(!ok){ setCodigoErr(true); return; } if(!hijos.some(h=>h.id===candidato.id)){ setHijos(p=>[...p,{ id:candidato.id, nombre:candidato.nombre, curso:candidato.curso }]); } setHijo(candidato.id); setCandidato(null); setCodigoInput(''); setCodigoErr(false); setVinculando(false); setRutBusca(''); };
  const vincular=(e)=>{ if(hijos.some(h=>h.id===e.id)){ setHijo(e.id); setVinculando(false); setRutBusca(''); return; } setCandidato(e); setCodigoInput(''); setCodigoErr(false); };
  const desvincular=(id)=>setHijos(p=>p.filter(h=>h.id!==id));
  const buscaHijo=(q)=>{ const s=q.trim(); if(!s) return []; const porRut=normRut(s); const porNom=s.toLowerCase(); return rosterApo.filter(e=> (e.rut && porRut.length>=3 && normRut(e.rut).includes(porRut)) || (porNom.length>=3 && String(e.nombre||'').toLowerCase().includes(porNom)) ).slice(0,20); };
  const conDoc = (revisiones||[]).find(r=>HIJOS.some(h=>h.id===r.estId));
  const [hijo,setHijo]=useState(HIJOS[0]?HIJOS[0].id:null);
  useEffect(()=>{ if(!HIJOS.some(h=>h.id===hijo)) setHijo(HIJOS[0]?HIJOS[0].id:null); },[hijos]);
  const hijoSel=HIJOS.find(h=>h.id===hijo) || HIJOS[0] || null;
  const inf=useInforme();
  const [subMsg,setSubMsg]=useState('');

  const subir=async(file)=>{
    if(!file) return;
    const esImagen=/^image\//.test(file.type);
    if(!esImagen && file.size>10*1024*1024){ setSubMsg('El PDF supera 10 MB; comprímelo o súbelo como foto.'); return; }
    setPhase('uploading'); setSubMsg('');
    try{
      const meta=await subirInformeArchivo(hijo, file);
      inf.cargar(hijo, { ...meta, origen:'Apoderado' });
      onUpload({ from:'Apoderado · '+(hijoSel.nombre||'Apoderado'), curso:normCurso(hijoSel.curso), doc:file.name, fecha:hoyStr(), estId:hijo });
      setHist(h=>[{ doc:file.name, fecha:'Hoy', estado:'Enviado al equipo' },...h]);
      setPhase('done');
    }catch(err){ setPhase('idle'); setSubMsg('No se pudo subir el informe: '+(err.message||'error')); }
  };

  // solo documentos del hijo seleccionado (match por estudiante)
  const mias = (revisiones||[]).filter(r => r.estId === hijo);
  const porRevisar = mias.filter(r => r.estado==='en_revision');
  const enCambios = mias.filter(r => r.estado==='cambios');
  const respondidos = mias.filter(r => r.estado==='respondido');
  const firmados = mias.filter(r => r.estado==='firmado');
  const archivadosMios = mias.filter(r => r.estado==='archivado');

  if(revisando) return <RevisionApoderado t={t} rev={revisando} onBack={()=>setRevisando(null)}
    onAprobar={(firma,obs)=>{ aprobarFirmar(revisando.id, firma, obs); setRevisando(null); }}
    onCambios={(c)=>{ solicitarCambios(revisando.id, c); setRevisando(null); }} />;

  return (
    <div style={{ maxWidth:560, margin:'0 auto', padding:'16px 16px 50px' }} className="fade">
      {candidato && (
        <div style={{ position:'fixed', inset:0, background:'rgba(20,30,26,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:400, padding:20 }} onClick={()=>{ setCandidato(null); setCodigoErr(false); }}>
          <div onClick={ev=>ev.stopPropagation()} style={{ background:'#fff', borderRadius:16, maxWidth:400, width:'100%', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }} className="scale">
            <div style={{ background:t.primary, color:'#fff', padding:'14px 18px', fontSize:14.5, fontWeight:800 }}>Verifica tu vínculo</div>
            <div style={{ padding:'18px 18px 20px' }}>
              <div style={{ fontSize:12.5, color:t.ink, lineHeight:1.5, marginBottom:4 }}>Vas a vincularte con <b>{candidato.nombre}</b> · {candidato.curso}.</div>
              <div style={{ fontSize:11.5, color:t.muted, lineHeight:1.5, marginBottom:12 }}>Ingresa el <b>código de vinculación</b> de 6 caracteres que te entregó el colegio (equipo psicoeducativo).</div>
              <input autoFocus value={codigoInput} onChange={e=>{ setCodigoInput(e.target.value.toUpperCase()); setCodigoErr(false); }} onKeyDown={e=>{ if(e.key==='Enter') confirmarVinculo(); }} placeholder="Ej: K7M2QP" maxLength={6} style={{ width:'100%', padding:'12px 13px', borderRadius:10, border:`1.5px solid ${codigoErr?'#B23A24':t.border}`, fontSize:18, fontWeight:800, letterSpacing:4, textAlign:'center', textTransform:'uppercase', outline:'none', color:t.ink }} />
              {codigoErr && <div style={{ fontSize:11, color:'#B23A24', fontWeight:700, marginTop:7 }}>Código incorrecto. Verifícalo con el colegio.</div>}
              <div style={{ display:'flex', gap:9, marginTop:16 }}>
                <button onClick={()=>{ setCandidato(null); setCodigoErr(false); }} style={{ flex:1, padding:11, background:t.soft, color:t.muted, border:'none', borderRadius:11, fontSize:12.5, fontWeight:700, cursor:'pointer' }}>Cancelar</button>
                <button onClick={confirmarVinculo} disabled={codigoInput.trim().length<6} style={{ flex:1.4, padding:11, background:codigoInput.trim().length<6?t.soft:t.primary, color:codigoInput.trim().length<6?t.muted:'#fff', border:'none', borderRadius:11, fontSize:12.5, fontWeight:700, cursor:codigoInput.trim().length<6?'default':'pointer' }}>Vincular</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {HIJOS.length===0 ? (
        <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:'20px 18px', marginTop:20 }} className="scale">
          <div style={{ fontFamily:t.display, fontSize:18, fontWeight:700, color:t.ink, marginBottom:4 }}>Vincula a tu estudiante</div>
          <div style={{ fontSize:12, color:t.muted, marginBottom:14, lineHeight:1.5 }}>Ingresa el <b>RUT</b> de tu hijo/a tal como está en el colegio, con guion y dígito verificador. <span style={{ color:t.primaryDark, fontWeight:700 }}>Ejemplo: 22478365-2</span>. Luego pediremos el <b>código de vinculación</b> que te entrega el colegio. Solo verás la información de tu estudiante.</div>
          <input value={rutBusca} onChange={e=>setRutBusca(e.target.value)} placeholder="RUT o nombre (ej: 22478365-2 o Isidora)" style={{ width:'100%', padding:'11px 13px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:13, outline:'none', background:t.card, color:t.ink }} />
          <div style={{ display:'flex', flexDirection:'column', gap:7, marginTop:10, maxHeight:280, overflowY:'auto' }}>
            {buscaHijo(rutBusca).map(e=>(
              <button key={e.id} onClick={()=>vincular(e)} style={{ textAlign:'left', cursor:'pointer', background:t.soft, border:`1px solid ${t.border}`, borderRadius:10, padding:'11px 13px', display:'flex', alignItems:'center', gap:11 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:t.card, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:t.primaryDark, fontFamily:t.display, flexShrink:0, fontSize:12 }}>{e.nombre.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
                <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13, fontWeight:700, color:t.ink }}>{e.nombre}</div><div style={{ fontSize:11, color:t.muted }}>{e.curso}{e.rut?' · '+maskRut(e.rut):''}</div></div>
                <span style={{ flexShrink:0, color:t.primary, fontSize:12, fontWeight:800 }}>Vincular</span>
              </button>
            ))}
            {(normRut(rutBusca).length>=3 || rutBusca.trim().length>=3) && buscaHijo(rutBusca).length===0 && <div style={{ textAlign:'center', color:t.muted, fontSize:12, padding:14 }}>No se encontró ese RUT ni nombre en la nómina. Verifícalo con el colegio.</div>}
          </div>
          <div style={{ marginTop:16, paddingTop:12, borderTop:`1px solid ${t.border}` }}>
            <div style={{ fontSize:10.5, color:t.muted, marginBottom:6 }}>¿Eres del equipo y quieres revisar la app? Ingresa el código de revisión.</div>
            <div style={{ display:'flex', gap:7 }}>
              <input value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&pin==='1234'){ setHijos([{ id:'e1', nombre:'Sofía Contreras', curso:'3°A Básico' },{ id:'e3', nombre:'Isidora Vera', curso:'I°A Medio' }]); } }} placeholder="Código" style={{ width:110, padding:'8px 11px', borderRadius:9, border:`1px solid ${t.border}`, fontSize:12.5, outline:'none', background:t.card, color:t.ink }} />
              <button onClick={()=>{ if(pin==='1234'){ setHijos([{ id:'e1', nombre:'Sofía Contreras', curso:'3°A Básico' },{ id:'e3', nombre:'Isidora Vera', curso:'I°A Medio' }]); } else { setPin(''); } }} style={{ background:t.soft, color:t.primaryDark, border:`1px solid ${t.border}`, borderRadius:9, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Entrar</button>
            </div>
          </div>
        </div>
      ) : (<React.Fragment>
      <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:'15px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon k="apoderado" c={t.primary} s={24} /></div>
        <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700, color:t.ink }}>Hola{(window.PSICO_USER&&window.PSICO_USER.nombre)?', '+window.PSICO_USER.nombre.split(' ')[0]:''}</div><div style={{ fontSize:11, color:t.muted }}>Apoderado/a{hijoSel?' · '+hijoSel.curso:''}</div></div>
        {HIJOS.length>1 && (
          <select value={hijo||''} onChange={e=>setHijo(e.target.value)} style={{ flexShrink:0, padding:'8px 10px', borderRadius:9, border:`1px solid ${t.border}`, fontSize:11.5, fontWeight:700, color:t.ink, background:t.card }}>
            {HIJOS.map(h=><option key={h.id} value={h.id}>{h.nombre.split(' ')[0]}</option>)}
          </select>
        )}
        <button onClick={()=>setVinculando(v=>!v)} title="Vincular otro estudiante" style={{ flexShrink:0, background:t.soft, color:t.primaryDark, border:`1px solid ${t.border}`, borderRadius:9, padding:'8px 11px', fontSize:12, fontWeight:800, cursor:'pointer' }}>＋</button>
      </div>
      {vinculando && (
        <div style={{ background:t.card, border:`1px solid ${t.primary}`, borderRadius:t.radius, padding:14, marginBottom:14 }} className="slide">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <div style={{ fontSize:12.5, fontWeight:800, color:t.ink }}>Mis estudiantes</div>
            <button onClick={()=>{ setVinculando(false); setRutBusca(''); }} style={{ background:'none', border:'none', fontSize:16, color:t.muted, cursor:'pointer' }}>✕</button>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:10 }}>
            {HIJOS.map(h=><span key={h.id} style={{ display:'inline-flex', alignItems:'center', gap:7, background:t.soft, color:t.ink, fontSize:11.5, fontWeight:700, padding:'4px 6px 4px 11px', borderRadius:99 }}>{h.nombre.split(' ')[0]} · {h.curso}<button onClick={()=>desvincular(h.id)} style={{ background:'none', border:'none', color:t.muted, cursor:'pointer', fontSize:14, lineHeight:1 }}>×</button></span>)}
          </div>
          <input value={rutBusca} onChange={e=>setRutBusca(e.target.value)} placeholder="RUT o nombre para vincular otro…" style={{ width:'100%', padding:'10px 13px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:13, outline:'none', background:t.card, color:t.ink }} />
          <div style={{ display:'flex', flexDirection:'column', gap:7, marginTop:9, maxHeight:220, overflowY:'auto' }}>
            {buscaHijo(rutBusca).filter(e=>!hijos.some(h=>h.id===e.id)).map(e=>(
              <button key={e.id} onClick={()=>vincular(e)} style={{ textAlign:'left', cursor:'pointer', background:t.soft, border:`1px solid ${t.border}`, borderRadius:10, padding:'10px 12px', display:'flex', alignItems:'center', gap:11 }}>
                <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13, fontWeight:700, color:t.ink }}>{e.nombre}</div><div style={{ fontSize:11, color:t.muted }}>{e.curso}{e.rut?' · '+maskRut(e.rut):''}</div></div>
                <span style={{ flexShrink:0, color:t.primary, fontSize:12, fontWeight:800 }}>Vincular</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* recordatorio automático */}
      {porRevisar.length>0 && (
        <div style={{ background:'#FFF7E6', border:'1px solid #F0D27A', borderRadius:t.radius, padding:'12px 15px', marginBottom:14, display:'flex', alignItems:'center', gap:11 }}>
          <span style={{ fontSize:20 }}>🔔</span>
          <div style={{ flex:1 }}><div style={{ fontSize:12.5, fontWeight:700, color:'#8a6400' }}>Tienes {porRevisar.length} documento(s) pendiente(s) de firma</div><div style={{ fontSize:10.5, color:'#9a7420', marginTop:1 }}>Recordatorio automático · revísalos y firma para continuar el proceso.</div></div>
        </div>
      )}

      {/* seguimiento del trámite */}
      {(()=>{
        const todas=[...porRevisar,...enCambios,...respondidos,...firmados,...archivadosMios];
        const pasos=[['Informe recibido',true],['En evaluación del equipo',true],['Por firmar',porRevisar.length>0||firmados.length>0||archivadosMios.length>0],['Finalizado',archivadosMios.length>0]];
        if(todas.length===0) return null;
        return (
          <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:'15px 16px', marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:800, color:t.ink, marginBottom:12 }}>Seguimiento del proceso</div>
            <div style={{ display:'flex', alignItems:'flex-start' }}>
              {pasos.map(([lbl,on],i)=>(
                <React.Fragment key={lbl}>
                  {i>0 && <div style={{ flex:1, height:2, background: on?t.primary:t.border, marginTop:11 }} />}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, width:72 }}>
                    <div style={{ width:24, height:24, borderRadius:'50%', background:on?t.primary:t.card, border:`2px solid ${on?t.primary:t.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>{on && <Icon k="check" c="#fff" s={13} />}</div>
                    <span style={{ fontSize:9, color:on?t.ink:t.muted, fontWeight:on?700:500, textAlign:'center', lineHeight:1.2 }}>{lbl}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      })()}

      {/* documentos por revisar y firmar */}
      {porRevisar.length>0 && (
        <div style={{ marginBottom:14 }} className="slide">
          {porRevisar.map(r=>(
            <div key={r.id} style={{ background:t.card, border:`1px solid ${t.accent}`, borderLeft:`4px solid ${t.accent}`, borderRadius:t.radius, padding:'14px 16px', marginBottom:9 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}><Icon k="bell" c={t.accent} s={17} /><span style={{ fontSize:10.5, fontWeight:800, color:'#9A6A12', textTransform:'uppercase', letterSpacing:0.5 }}>Documento por revisar y firmar</span></div>
              <div style={{ fontSize:13.5, fontWeight:700, color:t.ink }}>{r.planFull}</div>
              <div style={{ fontSize:11, color:t.muted, marginTop:2, marginBottom:11 }}>{r.estNombre} · {r.curso} · enviado {r.fecha}</div>
              <button onClick={()=>setRevisando(r)} style={{ width:'100%', padding:11, background:t.primary, color:'#fff', border:'none', borderRadius:11, fontSize:12.5, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}><Icon k="doc" c="#fff" s={16} />Revisar ajustes y firmar →</button>
            </div>
          ))}
        </div>
      )}

      {/* documentos con cambios solicitados — en revisión del equipo */}
      {enCambios.length>0 && enCambios.map(r=>(
        <div key={r.id} style={{ background:'#FCEFD9', border:'1px solid #E8C98A', borderLeft:'4px solid #C2841E', borderRadius:t.radius, padding:'13px 16px', marginBottom:9 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <Icon k="bell" c="#9A6A12" s={16} />
            <span style={{ fontSize:10.5, fontWeight:800, color:'#9A6A12', textTransform:'uppercase', letterSpacing:0.5 }}>En revisión del equipo</span>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:t.ink }}>{r.planFull}</div>
          <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{r.estNombre} · {r.curso}</div>
          <div style={{ marginTop:9, background:'#fff', border:'1px solid #E8C98A', borderRadius:9, padding:'9px 11px' }}>
            <div style={{ fontSize:9.5, fontWeight:800, color:'#9A6A12', textTransform:'uppercase', letterSpacing:0.4, marginBottom:3 }}>Tus observaciones</div>
            <div style={{ fontSize:11.5, color:t.ink, lineHeight:1.45 }}>“{r.obsApoderado}”</div>
          </div>
          <div style={{ fontSize:10.5, color:'#9A6A12', marginTop:8, fontWeight:600 }}>El equipo está ajustando el documento según tus comentarios. Te avisaremos cuando esté listo para firmar.</div>
        </div>
      ))}

      {respondidos.length>0 && respondidos.map(r=>(
        <div key={r.id} style={{ background:'#FBE6E2', border:'1px solid #E8B4AA', borderLeft:'4px solid #B23A24', borderRadius:t.radius, padding:'13px 16px', marginBottom:9 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <Icon k="bell" c="#B23A24" s={16} />
            <span style={{ fontSize:10.5, fontWeight:800, color:'#B23A24', textTransform:'uppercase', letterSpacing:0.5 }}>Respuesta del equipo · requiere entrevista</span>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:t.ink }}>{r.planFull}</div>
          <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{r.estNombre} · {r.curso}</div>
          <div style={{ marginTop:9, background:'#fff', border:'1px solid #E8B4AA', borderRadius:9, padding:'10px 12px' }}>
            <div style={{ fontSize:11.5, color:t.ink, lineHeight:1.5 }}>{r.respuestaEquipo}</div>
          </div>
          <a href="mailto:psicoeducativo@cmpe.cl?subject=Entrevista%20-%20${''}" onClick={e=>{ e.currentTarget.href='mailto:psicoeducativo@cmpe.cl?subject='+encodeURIComponent('Entrevista · '+r.curso+' · '+r.estNombre); }} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, marginTop:10, padding:11, background:t.primary, color:'#fff', borderRadius:11, fontSize:12, fontWeight:700, textDecoration:'none' }}>
            <Icon k="doc" c="#fff" s={15} />Escribir al equipo
          </a>
        </div>
      ))}

      {firmados.length>0 && firmados.map(r=>(
        <div key={r.id} style={{ background:'#E2F3EC', border:'1px solid #A8D8C0', borderRadius:t.radius, padding:'12px 15px', marginBottom:9, display:'flex', alignItems:'center', gap:10 }}>
          <Icon k="check" c="#1E7A53" s={18} />
          <div style={{ flex:1 }}><div style={{ fontSize:12.5, fontWeight:700, color:'#1E5A40' }}>{r.planFull} · firmado por ti</div><div style={{ fontSize:10.5, color:'#3E7A60', marginTop:1 }}>{r.fechaFirma} · Folio {r.folio} · en firma del equipo</div></div>
        </div>
      ))}

      {archivadosMios.map(r=>(
        <div key={r.id} style={{ background:t.card, border:`1px solid ${t.border}`, borderLeft:`4px solid #1E7A53`, borderRadius:t.radius, padding:'14px 16px', marginBottom:9 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <Icon k="check" c="#1E7A53" s={17} />
            <span style={{ fontSize:10.5, fontWeight:800, color:'#1E7A53', textTransform:'uppercase', letterSpacing:0.5 }}>Documento finalizado</span>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:t.ink }}>{r.planFull}</div>
          <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{r.estNombre} · {r.curso} · firmado por todo el equipo · Folio {r.folio}</div>
          <a href={'data:text/plain,'} onClick={e=>{ e.preventDefault(); imprimirOficial(PLANES.find(p=>p.id===r.planId)||PLANES[0], {id:r.estId,nombre:r.estNombre,curso:r.curso,diag:'',edad:''}, r.marcadas||{}, (r.adecKey==='PAEC'?ADEC_EVAL:r.adecKey==='PSM'?ADEC_PSM:ADEC_ACCESO), '', {}, r.director, r.equipo||{}, r.obs||'', r, true); }} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, marginTop:10, padding:11, background:t.primary, color:'#fff', borderRadius:11, fontSize:12, fontWeight:700, textDecoration:'none' }}>
            <Icon k="download" c="#fff" s={15} />Ver / descargar documento firmado
          </a>
        </div>
      ))}

      {/* zona de carga */}
      <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:20, marginBottom:14, textAlign:'center' }}>
        <div style={{ fontSize:14, fontWeight:700, color:t.ink, marginBottom:4 }}>Subir informe de especialista</div>
        <div style={{ fontSize:11.5, color:t.muted, marginBottom:16, lineHeight:1.5 }}>Adjunta el informe externo (neurología, psiquiatría, fonoaudiología…). El equipo psicoeducativo recibirá una notificación al instante.</div>
        {phase!=='done' ? (
          <label style={{ width:'100%', border:`2px dashed ${t.primary}`, background:t.soft, borderRadius:14, padding:'26px 16px', cursor:phase==='uploading'?'default':'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
            <input type="file" accept="application/pdf,image/*" disabled={phase==='uploading'} style={{ display:'none' }} onChange={(e)=>{ const f=e.target.files&&e.target.files[0]; e.target.value=''; subir(f); }} />
            <div style={{ width:52, height:52, borderRadius:'50%', background:t.card, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon k="upload" c={t.primary} s={26} /></div>
            <span style={{ fontSize:13, fontWeight:700, color:t.primaryDark }}>{phase==='uploading'?'Subiendo y notificando…':'Toca para seleccionar archivo'}</span>
            <span style={{ fontSize:10.5, color:t.muted }}>PDF, JPG o PNG · máx. 10 MB</span>
            {subMsg && <span style={{ fontSize:10.5, color:'#B23A24', fontWeight:700 }}>{subMsg}</span>}
          </label>
        ) : (
          <div style={{ background:t.soft, borderRadius:14, padding:'24px 16px' }} className="scale">
            <div style={{ width:54, height:54, borderRadius:'50%', background:t.primary, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}><Icon k="check" c="#fff" s={30} /></div>
            <div style={{ fontSize:14, fontWeight:800, color:t.ink }}>¡Informe enviado!</div>
            <div style={{ fontSize:11.5, color:t.muted, marginTop:5, lineHeight:1.5 }}>El equipo psicoeducativo fue notificado y procesará el documento de Sofía.</div>
            <button onClick={()=>setPhase('idle')} style={{ marginTop:14, background:t.card, border:`1px solid ${t.border}`, borderRadius:9, padding:'8px 16px', fontSize:11.5, fontWeight:700, color:t.ink, cursor:'pointer' }}>Subir otro informe</button>
          </div>
        )}
      </div>

      {/* historial */}
      <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:10 }}>Informes enviados</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {hist.map((h,i)=>(
          <div key={i} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'12px 14px', display:'flex', alignItems:'center', gap:11 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="doc" c={t.primary} s={18} /></div>
            <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:12.5, fontWeight:600, color:t.ink }}>{h.doc}</div><div style={{ fontSize:10.5, color:t.muted }}>{h.fecha}</div></div>
            <Chip t={t} label={h.estado} tone={h.estado==='Procesado'?'ok':'warn'} />
          </div>
        ))}
      </div>

      {/* glosario simple */}
      <div style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:'15px 16px', marginTop:14 }}>
        <div style={{ fontSize:12.5, fontWeight:800, color:t.ink, marginBottom:10 }}>¿Qué significan estos documentos?</div>
        {[['PAI','#2C7A6B','Plan interno de acompañamiento para derribar barreras (de aprendizaje, conducta o autonomía). Tu hijo/a sigue el currículo común con apoyo sistemático.'],['PACI','#185FA5','Plan excepcional y justificado que hace ajustes significativos en los objetivos, la evaluación o el acceso, cuando los apoyos previos no fueron suficientes.'],['PAEC','#C2841E','Adapta cómo se toman las pruebas (más tiempo, formato, etc.).'],['Plan Salud Mental','#7A4FB0','Apoyos para el bienestar emocional dentro del colegio.']].map(([k,c,v])=>(
          <div key={k} style={{ display:'flex', gap:11, marginBottom:9, alignItems:'stretch', background:c+'14', borderRadius:9, padding:'9px 11px' }}>
            <span style={{ flexShrink:0, width:62, fontSize:10.5, fontWeight:800, color:'#fff', background:c, borderRadius:6, padding:'3px 6px', textAlign:'center', lineHeight:1.25, alignSelf:'flex-start' }}>{k}</span>
            <span style={{ fontSize:11.5, color:t.ink, lineHeight:1.4 }}>{v}</span>
          </div>
        ))}
        <div style={{ fontSize:10.5, color:t.muted, marginTop:4, lineHeight:1.5 }}>Si tienes dudas, puedes escribir al equipo psicoeducativo: psicoeducativo@cmpe.cl</div>
      </div>
      </React.Fragment>)}
    </div>
  );
}

// ─── PANTALLA DE REVISIÓN DEL APODERADO (lectura + observaciones + firma) ──
function RevisionApoderado({ t, rev, onBack, onAprobar, onCambios }){
  const [obs,setObs]=useState('');
  const [modo,setModo]=useState(null); // null | cambios | firmar
  const adecSet = rev.adecKey==='PAEC' ? ADEC_EVAL : rev.adecKey==='PSM' ? ADEC_PSM : ADEC_ACCESO;
  const marcadas = rev.marcadas||{};
  // resumen: solo grupos con ítems marcados
  const grupos = adecSet.map((g,gi)=>({ tipo:g.tipo, items:g.items.filter((it,ii)=>marcadas[gi+'-'+ii]) })).filter(g=>g.items.length);

  return (
    <div style={{ maxWidth:560, margin:'0 auto', padding:'14px 16px 50px' }} className="fade">
      <button onClick={onBack} style={{ background:'none', border:'none', color:t.muted, fontSize:12.5, cursor:'pointer', marginBottom:12, fontWeight:600 }}>← Volver</button>

      <div style={{ background:t.headerGrad, color:'#fff', borderRadius:t.radius, padding:'16px 18px', marginBottom:12 }}>
        <div style={{ fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', letterSpacing:0.5 }}>Revisión de ajustes propuestos</div>
        <div style={{ fontFamily:t.display, fontSize:18, fontWeight:600, marginTop:3 }}>{rev.planFull}</div>
        <div style={{ fontSize:11.5, color:'rgba(255,255,255,0.75)', marginTop:2 }}>{rev.estNombre} · {rev.curso}</div>
      </div>

      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:16, marginBottom:12 }}>
        <div style={{ fontSize:12, color:t.muted, lineHeight:1.5, marginBottom:14 }}>El equipo psicoeducativo propone los siguientes apoyos para su hijo/a. Revíselos y, si está de acuerdo, apruebe y firme. Si desea ajustar algo, solicite cambios.</div>
        {grupos.map((g,i)=>(
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ fontSize:11.5, fontWeight:800, color:t.primaryDark, marginBottom:7 }}>{g.tipo}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {g.items.map((it,j)=>(
                <div key={j} style={{ display:'flex', gap:9, alignItems:'flex-start' }}>
                  <span style={{ width:18, height:18, borderRadius:6, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}><Icon k="check" c={t.primary} s={12} /></span>
                  <span style={{ fontSize:12, color:t.ink, lineHeight:1.4 }}>{it}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {(rev.obs || rev.solicitudApoderado) && <div style={{ marginTop:6, display:'flex', flexDirection:'column', gap:8 }}>
          {rev.obs && <div style={{ background:t.soft, borderRadius:10, padding:'10px 13px' }}><div style={{ fontSize:10.5, fontWeight:800, color:t.primaryDark, marginBottom:3 }}>Observaciones del equipo</div><div style={{ fontSize:11.5, color:t.ink, lineHeight:1.45, whiteSpace:'pre-line' }}>{rev.obs}</div></div>}
          {rev.solicitudApoderado && <div style={{ background:'#FCEFD9', borderRadius:10, padding:'10px 13px' }}><div style={{ fontSize:10.5, fontWeight:800, color:'#9A6A12', marginBottom:3 }}>Tu solicitud (incorporada)</div><div style={{ fontSize:11.5, color:t.ink, lineHeight:1.45, whiteSpace:'pre-line' }}>{rev.solicitudApoderado}</div></div>}
        </div>}
      </div>

      {!modo && (
        <div style={{ display:'flex', gap:9 }}>
          <button onClick={()=>setModo('cambios')} style={{ flex:1, padding:13, background:t.card, color:'#B23A24', border:'1px solid #E8B4AA', borderRadius:12, fontSize:12.5, fontWeight:700, cursor:'pointer' }}>Solicitar cambios</button>
          <button onClick={()=>setModo('firmar')} style={{ flex:1.4, padding:13, background:t.primary, color:'#fff', border:'none', borderRadius:12, fontSize:12.5, fontWeight:700, cursor:'pointer' }}>Aprobar y firmar →</button>
        </div>
      )}

      {modo==='cambios' && (
        <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:16 }} className="fade">
          <label style={{ fontSize:12, fontWeight:700, color:t.ink, display:'block', marginBottom:7 }}>¿Qué le gustaría ajustar?</label>
          <textarea value={obs} onChange={e=>setObs(e.target.value)} rows={3} placeholder="Escriba sus comentarios para el equipo…" style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:12, resize:'vertical', outline:'none', fontFamily:'inherit', color:t.ink }} />
          <div style={{ display:'flex', gap:9, marginTop:12 }}>
            <button onClick={()=>setModo(null)} style={{ flex:1, padding:11, background:t.card, color:t.muted, border:`1px solid ${t.border}`, borderRadius:11, fontSize:12, fontWeight:700, cursor:'pointer' }}>Cancelar</button>
            <button onClick={()=>obs.trim()&&onCambios(obs)} disabled={!obs.trim()} style={{ flex:1.4, padding:11, background:obs.trim()?'#B23A24':t.soft, color:obs.trim()?'#fff':t.muted, border:'none', borderRadius:11, fontSize:12, fontWeight:700, cursor:obs.trim()?'pointer':'default' }}>Enviar al equipo</button>
          </div>
        </div>
      )}

      {modo==='firmar' && <FirmaDigital t={t} rev={rev} onCancel={()=>setModo(null)} onFirmar={(firma)=>onAprobar(firma, obs)} />}
    </div>
  );
}

// ─── LIENZO DE FIRMA DIGITAL ─────────────────────────────────────
function FirmaDigital({ t, rev, onCancel, onFirmar, soloFirma }){
  const cv=useRef(null); const [vacio,setVacio]=useState(true); const [acepta,setAcepta]=useState(false);
  const ok = soloFirma ? !vacio : (!vacio && acepta);
  const dibujando=useRef(false);
  useEffect(()=>{ const c=cv.current; if(!c)return; const dpr=window.devicePixelRatio||1; c.width=c.offsetWidth*dpr; c.height=c.offsetHeight*dpr; const ctx=c.getContext('2d'); ctx.scale(dpr,dpr); ctx.lineWidth=2.2; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle=t.ink; },[]);
  const pos=(e)=>{ const c=cv.current; const r=c.getBoundingClientRect(); const p=e.touches?e.touches[0]:e; return { x:p.clientX-r.left, y:p.clientY-r.top }; };
  const start=(e)=>{ e.preventDefault(); dibujando.current=true; const ctx=cv.current.getContext('2d'); const {x,y}=pos(e); ctx.beginPath(); ctx.moveTo(x,y); };
  const move=(e)=>{ if(!dibujando.current)return; e.preventDefault(); const ctx=cv.current.getContext('2d'); const {x,y}=pos(e); ctx.lineTo(x,y); ctx.stroke(); setVacio(false); };
  const end=()=>{ dibujando.current=false; };
  const limpiar=()=>{ const c=cv.current; c.getContext('2d').clearRect(0,0,c.width,c.height); setVacio(true); };
  const confirmar=()=>{ if(!ok)return; onFirmar(cv.current.toDataURL('image/png')); };

  return (
    <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:16 }} className="fade">
      <div style={{ fontSize:13, fontWeight:800, color:t.ink, marginBottom:3 }}>Firma digital</div>
      <div style={{ fontSize:11, color:t.muted, marginBottom:11, lineHeight:1.45 }}>Dibuje su firma en el recuadro con el dedo o el mouse.</div>
      <div style={{ position:'relative', border:`2px dashed ${t.border}`, borderRadius:12, background:'#fff', marginBottom:6 }}>
        <canvas ref={cv} style={{ width:'100%', height:150, touchAction:'none', cursor:'crosshair', display:'block' }}
          onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
          onTouchStart={start} onTouchMove={move} onTouchEnd={end} />
        {vacio && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', color:t.muted, fontSize:12.5, fontStyle:'italic' }}>Firme aquí ✍️</div>}
      </div>
      <div style={{ textAlign:'right', marginBottom:12 }}><button onClick={limpiar} style={{ background:'none', border:'none', color:t.primary, fontSize:11.5, fontWeight:700, cursor:'pointer' }}>Limpiar</button></div>
      {!soloFirma && <button onClick={()=>setAcepta(a=>!a)} style={{ display:'flex', alignItems:'flex-start', gap:9, textAlign:'left', background:'none', border:'none', cursor:'pointer', padding:0, marginBottom:14 }}>
        <span style={{ width:19, height:19, borderRadius:5, flexShrink:0, marginTop:1, border:`1.5px solid ${acepta?t.primary:t.border}`, background:acepta?t.primary:t.card, display:'flex', alignItems:'center', justifyContent:'center' }}>{acepta && <Icon k="check" c="#fff" s={12} />}</span>
        <span style={{ fontSize:11.5, color:t.ink, lineHeight:1.45 }}>He leído y <b>apruebo</b> los apoyos propuestos para mi hijo/a. Mi firma queda registrada con fecha, hora y folio único.</span>
      </button>}
      <div style={{ display:'flex', gap:9 }}>
        <button onClick={onCancel} style={{ flex:1, padding:12, background:t.card, color:t.muted, border:`1px solid ${t.border}`, borderRadius:11, fontSize:12, fontWeight:700, cursor:'pointer' }}>Cancelar</button>
        <button onClick={confirmar} disabled={!ok} style={{ flex:1.4, padding:12, background:ok?t.primary:t.soft, color:ok?'#fff':t.muted, border:'none', borderRadius:11, fontSize:12, fontWeight:700, cursor:ok?'pointer':'default' }}>{soloFirma?'Registrar firma ✓':'Firmar y aprobar ✓'}</button>
      </div>
    </div>
  );
}

// ════════════════ GESTIÓN (Rectoría y Dirección) ════════════════
// 3 ciclos del colegio
const CICLOS_GESTION = [
  { id:'c1', nombre:'Primer Ciclo', rango:'Pre-Kínder a 2° Básico', niveles:['PK','K','1°','2°'] },
  { id:'c2', nombre:'Segundo Ciclo', rango:'3° a 6° Básico', niveles:['3°','4°','5°','6°'] },
  { id:'c3', nombre:'Tercer Ciclo', rango:'7° Básico a IV° Medio', niveles:['7°','8°','I°','II°','III°','IV°'] },
];
// datos demo por curso: nee, firmados, por firmar
const GESTION_CURSOS = [
  { curso:'PK-A', ciclo:'c1', nee:1, firmados:1, porFirmar:0 },
  { curso:'K-B', ciclo:'c1', nee:2, firmados:1, porFirmar:1 },
  { curso:'1°A', ciclo:'c1', nee:1, firmados:1, porFirmar:0 },
  { curso:'2°B', ciclo:'c1', nee:2, firmados:1, porFirmar:1 },
  { curso:'3°A', ciclo:'c2', nee:3, firmados:2, porFirmar:1 },
  { curso:'4°B', ciclo:'c2', nee:2, firmados:2, porFirmar:0 },
  { curso:'5°B', ciclo:'c2', nee:4, firmados:2, porFirmar:2 },
  { curso:'6°C', ciclo:'c2', nee:2, firmados:1, porFirmar:1 },
  { curso:'7°A', ciclo:'c3', nee:3, firmados:2, porFirmar:1 },
  { curso:'8°D', ciclo:'c3', nee:2, firmados:2, porFirmar:0 },
  { curso:'I°A', ciclo:'c3', nee:3, firmados:1, porFirmar:2 },
  { curso:'II°B', ciclo:'c3', nee:2, firmados:1, porFirmar:1 },
  { curso:'III°C', ciclo:'c3', nee:1, firmados:1, porFirmar:0 },
  { curso:'IV°A', ciclo:'c3', nee:2, firmados:1, porFirmar:1 },
];
// Filas de Gestión derivadas del ROSTER REAL (caseload + revisiones), no demo.
function cicloDeCurso(code){ const g=String(code||'').replace(/[A-E]$/,''); if(['PK','K','1°','2°'].includes(g)) return 'c1'; if(['3°','4°','5°','6°'].includes(g)) return 'c2'; return 'c3'; }
function gestionRowsReales(){
  const extra=lsGet('psico_extra_v1',[]);
  const revis=lsGet('psico_revisiones_v1',[]);
  const roster=[...ESTUDIANTES,...extra];
  const infD=infLoad(), segD=segLoad();
  const cursoDe={}; roster.forEach(e=>{ cursoDe[e.id]=normCurso(e.curso); });
  const nee={}, firmSet={};
  roster.forEach(e=>{ if(enSeguimiento(e,infD,revis,segD)){ const c=normCurso(e.curso); nee[c]=(nee[c]||0)+1; } });
  (revis||[]).forEach(r=>{ const c=cursoDe[r.estId]; if(!c) return; if(r.estado==='firmado'||r.estado==='archivado'){ firmSet[c]=firmSet[c]||new Set(); firmSet[c].add(r.estId); } });
  return Object.keys(nee).sort().map(c=>{ const f=firmSet[c]?firmSet[c].size:0; return { curso:c, ciclo:cicloDeCurso(c), nee:nee[c], firmados:f, porFirmar:Math.max(0,nee[c]-f) }; });
}
function aggrega(rows){
  const nee=rows.reduce((a,r)=>a+r.nee,0), f=rows.reduce((a,r)=>a+r.firmados,0), p=rows.reduce((a,r)=>a+r.porFirmar,0);
  const total=f+p; const pct= total? Math.round(f/total*100):0;
  return { nee, firmados:f, porFirmar:p, total, pct };
}
function tono(pct){ return pct>=80?{c:'#1E7A53',bg:'#E2F3EC'}:pct>=50?{c:'#2563B8',bg:'#E8F0FB'}:{c:'#B23A24',bg:'#FBE6E2'}; }

// avance por tipo de documento (demo) — firmados / total de cada plan
const GESTION_TENDENCIA = [ ['Mar',42],['Abr',51],['May',58],['Jun',63] ];
const GESTION_ADHERENCIA = { '3°A':[5,6], '5°B':[3,6], '7°A':[4,5], 'I°A':[2,6], 'II°B':[5,5], '4°B':[6,6] };
const GESTION_DOCS = [
  { id:'PAI', nombre:'P.A.I.', full:'Plan de Acompañamiento Individual', firmados:9, total:11, color:'#2C7A6B' },
  { id:'PACI', nombre:'P.A.C.I.', full:'Plan de Adecuación Curricular Individual', firmados:6, total:8, color:'#185FA5' },
  { id:'PAEC', nombre:'P.A.E.C.', full:'Plan de Adecuación Evaluativa', firmados:4, total:7, color:'#C2841E' },
  { id:'PSM', nombre:'Plan Salud Mental', full:'Plan Curricular Salud Mental', firmados:2, total:5, color:'#7A4FB0' },
];
// DOCS reales por tipo de plan, desde las revisiones (firmados/total)
// Adherencia docente REAL (Opción B): denominador = asignaturas con apoyo reportado
// para estudiantes en seguimiento; numerador = de esas, cuántas confirmó el profesor.
// Devuelve { curso: [confirmadas, totalConApoyo] } — solo cursos que tienen apoyos.
function gestionAdherenciaReal(){
  const apoyos=lsGet('psico_apoyos_v1',{});
  const lect=lsGet('psico_lectura_v1',{});
  const seg=lsGet('psico_seg_v1',{});
  const inf=infLoad(); const revis=lsGet('psico_revisiones_v1',[]);
  const roster=[...ESTUDIANTES,...lsGet('psico_extra_v1',[])];
  const norm=(s)=>String(s||'').trim().toLowerCase();
  const out={};
  roster.forEach(e=>{
    if(!enSeguimiento(e,inf,revis,seg)) return;
    const asigs=[...new Set((apoyos[e.id]||[]).map(a=>a.asignatura).filter(Boolean))];
    if(!asigs.length) return;
    const cur=normCurso(e.curso); out[cur]=out[cur]||[0,0];
    asigs.forEach(asig=>{ out[cur][1]++; const conf=Object.keys(lect).some(k=> k.startsWith(e.id+'::') && norm(k.split('::')[1])===norm(asig) && lect[k]); if(conf) out[cur][0]++; });
  });
  return out;
}
function gestionDocsReales(){
  const revis=lsGet('psico_revisiones_v1',[]);
  const META={ PAI:{ nombre:'P.A.I.', full:'Plan de Acompañamiento Individual', color:'#2C7A6B' }, PACI:{ nombre:'P.A.C.I.', full:'Plan de Adecuación Curricular Individual', color:'#185FA5' }, PAEC:{ nombre:'P.A.E.C.', full:'Plan de Adecuación Evaluativa', color:'#C2841E' }, PSM:{ nombre:'Plan Salud Mental', full:'Plan Curricular Salud Mental', color:'#7A4FB0' } };
  const c={ PAI:[0,0], PACI:[0,0], PAEC:[0,0], PSM:[0,0] };
  (revis||[]).forEach(r=>{ const k=c[r.planId]?r.planId:'PAI'; c[k][1]++; if(r.estado==='firmado'||r.estado==='archivado') c[k][0]++; });
  return Object.keys(META).map(id=>({ id, ...META[id], firmados:c[id][0], total:c[id][1] }));
}
// Tendencia real: % de planes firmados acumulado por mes, desde fechaFirma de las revisiones
function gestionTendenciaReal(){
  const revis=lsGet('psico_revisiones_v1',[]);
  const MESES=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const firmadas=(revis||[]).filter(r=>r.estado==='firmado'||r.estado==='archivado');
  const total=(revis||[]).length;
  if(!total || !firmadas.length) return [];
  const porMes={}; firmadas.forEach(r=>{ const m=(String(r.fechaFirma||'').match(/\b(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)/i)||[])[1]; if(!m) return; const idx=MESES.findIndex(x=>x.toLowerCase()===m.toLowerCase()); if(idx>=0) porMes[idx]=(porMes[idx]||0)+1; });
  const idxs=Object.keys(porMes).map(Number).sort((a,b)=>a-b);
  if(!idxs.length) return [];
  let acum=0; return idxs.map(i=>{ acum+=porMes[i]; return [MESES[i], Math.round(acum/total*100)]; });
}

const GESTION_VENCE = [
  { curso:'I°A', plan:'PACI', dias:9 },
  { curso:'5°B', plan:'PAI', dias:21 },
  { curso:'7°A', plan:'PAEC', dias:28 },
];
// parámetros de ahorro de tiempo (ROI) — demo, editables por el colegio
const AHORRO = { horasPorDoc:3.5, valorHora:14000, docsSemana:6, docsMes:23, docsAnio:148 };

function GestionDashboard({ t, revisiones }){
  const [tab,setTab]=useState('resumen'); // resumen | tendencia | ciclos | cursos
  const GC = gestionRowsReales();
  const colegio = aggrega(GC);
  // Planes por vencer: derivado de revisiones firmadas/archivadas (vigencia anual real)
  const MES3=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const vence = (revisiones||[]).filter(r=>r.estado==='firmado'||r.estado==='archivado').map(r=>{
    const m=(String(r.fechaFirma||'').match(/(\d{1,2})\s*([a-z]{3})/i)); if(!m) return null;
    const dia=parseInt(m[1],10); const mi=MES3.indexOf(m[2].toLowerCase()); if(mi<0) return null;
    const firma=new Date(2026,mi,dia); const vto=new Date(firma.getTime()+365*864e5);
    const dias=Math.ceil((vto-new Date())/864e5);
    return (dias>0 && dias<=30) ? { curso:normCurso(r.curso), plan:r.planNombre||r.planId, dias } : null;
  }).filter(Boolean);
  const enRonda = (revisiones||[]).filter(r=> r.estado==='firmado').length;
  const archivados = (revisiones||[]).filter(r=> r.estado==='archivado').length;
  const TENDENCIA = gestionTendenciaReal();
  const DOCS = gestionDocsReales();
  // adherencia docente: se alimenta de las confirmaciones 'leído y aplicado' de los profesores
  const ADHERENCIA = gestionAdherenciaReal();
  const adhTot = Object.values(ADHERENCIA).reduce((a,v)=>a+(Array.isArray(v)?v[0]:0),0);
  const adhMax = Object.values(ADHERENCIA).reduce((a,v)=>a+(Array.isArray(v)?v[1]:0),0);
  const adhPct = adhMax? Math.round(adhTot/adhMax*100):0;
  const cuellos = GC.filter(r=>r.porFirmar>0).map(r=>({ ...r, dias: 10+Math.round(r.porFirmar*7) })).filter(r=>r.dias>=20).sort((a,b)=>b.dias-a.dias).slice(0,4);

  const Anillo=({ pct, size=92 })=>{
    const tn=tono(pct); const r=(size-12)/2; const circ=2*Math.PI*r;
    return (
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.soft} strokeWidth="10" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={tn.c} strokeWidth="10" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} />
        <text x="50%" y="50%" fill={t.ink} fontSize={size*0.24} fontWeight="700" textAnchor="middle" dominantBaseline="central" transform={`rotate(90 ${size/2} ${size/2})`}>{pct}%</text>
      </svg>
    );
  };
  const Barra=({ pct })=>{ const tn=tono(pct); return <div style={{ background:t.soft, borderRadius:99, height:8, overflow:'hidden' }}><div style={{ width:pct+'%', height:'100%', background:tn.c, borderRadius:99 }} /></div>; };

  return (
    <div style={{ maxWidth:820, margin:'0 auto', padding:'16px 16px 50px' }} className="fade">
      {/* subpestañas */}
      <div style={{ display:'flex', gap:4, background:t.soft, padding:4, borderRadius:12, marginBottom:14, flexWrap:'wrap' }}>
        {[['resumen','Colegio'],['cumplimiento','Cumplimiento'],['ahorro','Ahorro'],['tendencia','Tendencia'],['ciclos','Ciclos'],['cursos','Cursos']].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ flex:'1 1 auto', padding:'9px 8px', fontSize:11.5, fontWeight:700, borderRadius:9, border:'none', cursor:'pointer', background:tab===id?t.card:'transparent', color:tab===id?t.primary:t.muted, boxShadow:tab===id?'0 1px 4px rgba(0,0,0,0.08)':'none', whiteSpace:'nowrap' }}>{label}</button>
        ))}
      </div>

      {/* CUMPLIMIENTO NORMATIVO · Decreto 83/67 */}
      {tab==='cumplimiento' && (()=>{
        const alDia=colegio.pct>=80; const enRiesgo=colegio.pct<50;
        const estadoC=alDia?{c:'#1E7A53',bg:'#E2F3EC',lbl:'Al día'}:enRiesgo?{c:'#B23A24',bg:'#FBE6E2',lbl:'En riesgo'}:{c:'#C2841E',bg:'#FCEFD9',lbl:'Requiere atención'};
        const paec=DOCS.find(d=>d.id==='PAEC'); const vencidos=0;
        const items=[
          { ok:colegio.pct>=80, t:'Planes de apoyo (PAI/PACI) vigentes y firmados', d:`${colegio.firmados} de ${colegio.total} documentos firmados`, dec:'Decreto 83/2015' },
          { ok:vence.length===0, t:'Sin planes vencidos', d:`${vence.length} plan(es) por vencer en los próximos 30 días`, dec:'Vigencia anual' },
          { ok:paec.total===0?true:(paec.firmados/paec.total)>=0.7, t:'Adecuaciones evaluativas declaradas (PAEC)', d:`${paec.firmados} de ${paec.total} evaluaciones diferenciadas formalizadas`, dec:'Decreto 67/2018' },
          { ok:true, t:'Registro de firmas del equipo y del apoderado', d:'Cada plan queda con folio, fecha y firmas trazables', dec:'Respaldo auditable' },
        ];
        return (
        <div className="fade">
          <div style={{ background:estadoC.bg, border:`1px solid ${estadoC.c}44`, borderRadius:t.radius, padding:'18px 20px', marginBottom:14, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <div style={{ width:56, height:56, borderRadius:14, background:estadoC.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="check" c="#fff" s={30} /></div>
            <div style={{ flex:1, minWidth:180 }}>
              <div style={{ fontSize:11, fontWeight:800, color:estadoC.c, textTransform:'uppercase', letterSpacing:0.6 }}>Cumplimiento normativo</div>
              <div style={{ fontFamily:t.display, fontSize:20, fontWeight:700, color:t.ink, margin:'2px 0' }}>Decreto 83/2015 · Decreto 67/2018</div>
              <div style={{ fontSize:12, color:t.muted }}>Estado del establecimiento frente a una fiscalización de la Superintendencia.</div>
            </div>
            <div style={{ textAlign:'center', flexShrink:0 }}>
              <div style={{ fontSize:34, fontWeight:800, color:estadoC.c, lineHeight:1 }}>{colegio.pct}%</div>
              <span style={{ display:'inline-block', marginTop:5, background:estadoC.c, color:'#fff', fontSize:11, fontWeight:800, padding:'3px 12px', borderRadius:99 }}>{estadoC.lbl}</span>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:14 }}>
            {items.map((it,i)=>(
              <div key={i} style={{ background:t.card, border:`1px solid ${t.border}`, borderLeft:`4px solid ${it.ok?'#1E7A53':'#C2841E'}`, borderRadius:t.radius, padding:'12px 15px', display:'flex', alignItems:'flex-start', gap:12 }}>
                <span style={{ width:24, height:24, borderRadius:'50%', background:it.ok?'#E2F3EC':'#FCEFD9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}><Icon k={it.ok?'check':'bell'} c={it.ok?'#1E7A53':'#C2841E'} s={14} /></span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
                    <span style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{it.t}</span>
                    <span style={{ fontSize:9.5, fontWeight:800, color:t.primaryDark, background:t.soft, padding:'2px 9px', borderRadius:99, whiteSpace:'nowrap' }}>{it.dec}</span>
                  </div>
                  <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{it.d}</div>
                </div>
              </div>
            ))}
          </div>
          {vence.length>0 && (
            <React.Fragment>
              <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:8 }}>Planes por vencer</div>
              <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, overflow:'hidden', marginBottom:8 }}>
                {vence.slice().sort((a,b)=>a.dias-b.dias).map((v,i)=>{ const urg=v.dias<=14; return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 15px', borderTop:i>0?`1px solid ${t.border}`:'none' }}>
                    <span style={{ width:10, height:10, borderRadius:'50%', background:urg?'#B23A24':'#C2841E', flexShrink:0 }} />
                    <div style={{ flex:1 }}><span style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{v.plan} · Curso {v.curso}</span></div>
                    <span style={{ fontSize:11, fontWeight:800, color:urg?'#B23A24':'#C2841E', background:urg?'#FBE6E2':'#FCEFD9', padding:'3px 11px', borderRadius:99 }}>Vence en {v.dias} días</span>
                  </div>
                );})}
              </div>
            </React.Fragment>
          )}
          <div style={{ background:t.soft, borderRadius:t.radius, padding:'12px 15px', fontSize:11, color:t.primaryDark, lineHeight:1.5 }}><b>Listo para fiscalización.</b> Todos los planes, firmas y plazos quedan registrados y exportables. Ante una visita de la Superintendencia, la evidencia de cumplimiento se descarga en un clic.</div>
        </div>
        );
      })()}

      {/* AHORRO DE TIEMPO · ROI */}
      {tab==='ahorro' && (()=>{
        const fmt=(n)=>'$'+Math.round(n).toLocaleString('es-CL');
        const docsMes=(revisiones||[]).filter(r=>r.estado==='firmado'||r.estado==='archivado').length;
        const AH={ horasPorDoc:3.5, valorHora:14000, docsSemana:docsMes, docsMes:docsMes, docsAnio:docsMes };
        const hSem=Math.round(AH.docsSemana*AH.horasPorDoc);
        const hMes=Math.round(AH.docsMes*AH.horasPorDoc);
        const hAnio=Math.round(AH.docsAnio*AH.horasPorDoc);
        const desglose=[
          { t:'Planes pre-rellenados con IA', d:'La IA lee el informe y propone adecuaciones', h:Math.round(AH.docsMes*2.2) },
          { t:'Firma digital (sin imprimir ni juntar al equipo)', d:'Ronda de firmas en línea con folio', h:Math.round(AH.docsMes*0.8) },
          { t:'Expedientes y reportes automáticos', d:'Documentación lista para descargar', h:Math.round(AH.docsMes*0.5) },
        ];
        return (
        <div className="fade">
          <div style={{ background:t.headerGrad, color:'#fff', borderRadius:t.radius, padding:'22px 24px', marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:800, opacity:0.85, textTransform:'uppercase', letterSpacing:0.6 }}>Ahorro de tiempo del equipo · este mes</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:10, marginTop:6, flexWrap:'wrap' }}>
              <span style={{ fontFamily:t.display, fontSize:46, fontWeight:800, lineHeight:1 }}>{hMes} h</span>
              <span style={{ fontSize:15, fontWeight:700, opacity:0.9 }}>≈ {fmt(hMes*AH.valorHora)} en tiempo profesional</span>
            </div>
            <div style={{ fontSize:12, opacity:0.85, marginTop:8 }}>{AH.docsMes} documentos gestionados · {AH.horasPorDoc} h ahorradas por documento (promedio).</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
            {[['Esta semana',hSem+' h',fmt(hSem*AH.valorHora)],['Este mes',hMes+' h',fmt(hMes*AH.valorHora)],['Acumulado año',hAnio+' h',fmt(hAnio*AH.valorHora)]].map(([l,v,m])=>(
              <div key={l} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'14px 12px', textAlign:'center' }}>
                <div style={{ fontFamily:t.display, fontSize:24, fontWeight:800, color:t.primary }}>{v}</div>
                <div style={{ fontSize:11, fontWeight:700, color:'#1E7A53', marginTop:2 }}>{m}</div>
                <div style={{ fontSize:10, color:t.muted, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:8 }}>¿De dónde sale el ahorro?</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
            {desglose.map((d,i)=>(
              <div key={i} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'12px 15px', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="spark" c={t.primary} s={18} /></div>
                <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{d.t}</div><div style={{ fontSize:10.5, color:t.muted, marginTop:1 }}>{d.d}</div></div>
                <span style={{ fontSize:14, fontWeight:800, color:t.primary, flexShrink:0 }}>{d.h} h</span>
              </div>
            ))}
          </div>
          <div style={{ background:t.soft, borderRadius:t.radius, padding:'13px 16px', fontSize:11.5, color:t.primaryDark, lineHeight:1.5 }}><b>Retorno de la inversión.</b> El equipo recupera <b>{hMes} horas al mes</b> para lo que importa: acompañar a los estudiantes. Rumbo cuesta una fracción del valor de esas horas.</div>
        </div>
        );
      })()}

      {/* RESUMEN COLEGIO */}
      {tab==='resumen' && (
        <div className="fade" id="gestion-print">
          <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:20, marginBottom:14, display:'flex', alignItems:'center', gap:22, flexWrap:'wrap' }}>
            <Anillo pct={colegio.pct} size={104} />
            <div style={{ flex:1, minWidth:180 }}>
              <div style={{ fontFamily:t.display, fontSize:19, fontWeight:700, color:t.ink }}>Avance del colegio</div>
              <div style={{ fontSize:12, color:t.muted, marginTop:3, marginBottom:10 }}>{colegio.firmados} de {colegio.total} documentos firmados</div>
              <div style={{ display:'flex', gap:18 }}>
                <div><div style={{ fontSize:22, fontWeight:800, color:'#1E7A53' }}>{colegio.firmados}</div><div style={{ fontSize:10.5, color:t.muted }}>Firmados</div></div>
                <div><div style={{ fontSize:22, fontWeight:800, color:'#B23A24' }}>{colegio.porFirmar}</div><div style={{ fontSize:10.5, color:t.muted }}>Por firmar</div></div>
                <div><div style={{ fontSize:22, fontWeight:800, color:t.primary }}>{colegio.nee}</div><div style={{ fontSize:10.5, color:t.muted }}>Estudiantes NEE</div></div>
              </div>
            </div>
          </div>
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:10 }}>Avance por ciclo</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {CICLOS_GESTION.map(c=>{ const ag=aggrega(GC.filter(r=>r.ciclo===c.id)); const tn=tono(ag.pct); return (
              <div key={c.id} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'13px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div><div style={{ fontSize:13, fontWeight:700, color:t.ink }}>{c.nombre}</div><div style={{ fontSize:10.5, color:t.muted }}>{c.rango}</div></div>
                  <div style={{ background:tn.bg, color:tn.c, fontSize:13, fontWeight:800, padding:'3px 12px', borderRadius:99 }}>{ag.pct}%</div>
                </div>
                <Barra pct={ag.pct} />
                <div style={{ fontSize:10.5, color:t.muted, marginTop:6 }}>{ag.firmados} firmados · {ag.porFirmar} por firmar · {ag.nee} estudiantes NEE</div>
              </div>
            );})}
          </div>
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, margin:'18px 0 10px' }}>Estado de la ronda de firmas</div>
          <div style={{ display:'flex', gap:10, marginBottom:4 }}>
            <div style={{ flex:1, background:t.card, border:`1px solid ${t.border}`, borderLeft:'4px solid #9A6A12', borderRadius:t.radius, padding:'13px 15px' }}>
              <div style={{ fontSize:24, fontWeight:800, color:'#9A6A12' }}>{enRonda}</div>
              <div style={{ fontSize:10.5, color:t.muted, marginTop:2 }}>En recolección de firmas</div>
            </div>
            <div style={{ flex:1, background:t.card, border:`1px solid ${t.border}`, borderLeft:'4px solid #1E7A53', borderRadius:t.radius, padding:'13px 15px' }}>
              <div style={{ fontSize:24, fontWeight:800, color:'#1E7A53' }}>{archivados}</div>
              <div style={{ fontSize:10.5, color:t.muted, marginTop:2 }}>Firmados y archivados</div>
            </div>
          </div>

          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, margin:'18px 0 10px' }}>Avance por tipo de documento</div>
          <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
            {DOCS.map(d=>{ const pct=d.total?Math.round(d.firmados/d.total*100):0; const tn=tono(pct); return (
              <div key={d.id} style={{ background:t.card, border:`1px solid ${t.border}`, borderLeft:`4px solid ${d.color}`, borderRadius:t.radius, padding:'12px 15px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                  <div><div style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{d.nombre}</div><div style={{ fontSize:10, color:t.muted }}>{d.full}</div></div>
                  <div style={{ background:tn.bg, color:tn.c, fontSize:13, fontWeight:800, padding:'3px 12px', borderRadius:99 }}>{pct}%</div>
                </div>
                <Barra pct={pct} />
                <div style={{ fontSize:10.5, color:t.muted, marginTop:6 }}>{d.firmados} firmados de {d.total} · {d.total-d.firmados} por firmar</div>
              </div>
            );})}
          </div>

          {/* adherencia docente */}
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, margin:'18px 0 10px' }}>Adherencia docente en aula</div>
          {adhMax===0 ? (
            <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'16px', textAlign:'center', color:t.muted, fontSize:12 }}>Aún sin datos de adherencia. Se poblará cuando los profesores confirmen "leído y aplicado" en sus asignaturas.</div>
          ) : (
          <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'14px 16px', display:'flex', alignItems:'center', gap:18 }}>
            <Anillo pct={adhPct} size={86} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12.5, color:t.ink, fontWeight:600 }}>{adhTot} de {adhMax} asignaturas confirmaron leído y aplicado</div>
              <div style={{ fontSize:11, color:t.muted, marginTop:3 }}>Mide si los apoyos definidos están llegando realmente a las salas.</div>
              {Object.entries(ADHERENCIA).filter(([,v])=>Array.isArray(v)&&v[1]&&v[0]/v[1]<0.5).map(([cur,v])=>(
                <div key={cur} style={{ fontSize:10.5, color:'#B23A24', fontWeight:600, marginTop:4 }}>{cur}: solo {v[0]} de {v[1]} asignaturas confirmaron</div>
              ))}
            </div>
          </div>
          )}

          {/* cuellos de botella */}
          {cuellos.length>0 && (
            <React.Fragment>
              <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, margin:'18px 0 10px' }}>Cuellos de botella · documentos estancados</div>
              <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, overflow:'hidden' }}>
                {cuellos.map((c,i)=>(
                  <div key={c.curso} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 15px', borderTop: i>0?`1px solid ${t.border}`:'none' }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:'#FBE6E2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:800, color:'#B23A24', fontSize:12 }}>{c.curso}</div>
                    <div style={{ flex:1 }}><div style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{c.porFirmar} documento(s) sin firmar</div><div style={{ fontSize:10.5, color:t.muted }}>{c.nee} estudiantes NEE</div></div>
                    <span style={{ background:'#FBE6E2', color:'#B23A24', fontSize:11, fontWeight:800, padding:'3px 11px', borderRadius:99 }}>{c.dias} días</span>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}

          {/* cumplimiento normativo */}
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, margin:'18px 0 10px' }}>Cumplimiento normativo</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {(()=>{ const d83=(()=>{ const g=DOCS.filter(d=>d.id==='PAI'||d.id==='PACI'); const tot=g.reduce((a,d)=>a+d.total,0), fi=g.reduce((a,d)=>a+d.firmados,0); return tot?Math.round(fi/tot*100):0; })(); const paec2=DOCS.find(d=>d.id==='PAEC'); const d67=paec2&&paec2.total?Math.round(paec2.firmados/paec2.total*100):0; const vig=colegio.pct||0; const arch=Math.round(archivados/(enRonda+archivados||1)*100); return [['Decreto 83/2015 · Diversificación de la enseñanza',d83],['Decreto 67/2018 · Evaluación y promoción',d67],['Planes con revisión vigente (al día)',vig],['Documentación firmada y archivada',arch]]; })().map(([lbl,pct])=>{ const tn=tono(pct); return (
              <div key={lbl} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'11px 15px', display:'flex', alignItems:'center', gap:12 }}>
                <Icon k="check" c={tn.c} s={17} />
                <span style={{ flex:1, fontSize:11.5, color:t.ink, fontWeight:600 }}>{lbl}</span>
                <span style={{ background:tn.bg, color:tn.c, fontSize:12, fontWeight:800, padding:'2px 11px', borderRadius:99 }}>{pct}%</span>
              </div>
            );})}
          </div>
          <div style={{ fontSize:9.5, color:t.muted, marginTop:8, lineHeight:1.5 }}>Indicadores referenciales para fiscalización (Superintendencia de Educación). Descargables en el informe oficial.</div>

          {/* seguridad y auditoría */}
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, margin:'18px 0 10px' }}>Seguridad y privacidad</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[['lock','Datos de salud cifrados','Información sensible de menores protegida en reposo y tránsito.'],['users','Acceso por roles','Cada perfil ve solo lo que le corresponde (Ley 19.628 de datos personales).'],['download','Respaldos automáticos','Copia diaria · último respaldo hoy 03:00.'],['shield','Registro de auditoría','Cada acceso y edición de ficha queda registrado.']].map(([ic,tl,ds])=>(
              <div key={tl} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'11px 14px', display:'flex', gap:11, alignItems:'flex-start' }}>
                <span style={{ flexShrink:0, width:30, height:30, borderRadius:8, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon k={ic} c={t.primary} s={17} /></span>
                <div><div style={{ fontSize:12, fontWeight:700, color:t.ink }}>{tl}</div><div style={{ fontSize:10.5, color:t.muted, marginTop:1, lineHeight:1.4 }}>{ds}</div></div>
                <span style={{ marginLeft:'auto', flexShrink:0, fontSize:10, fontWeight:800, color:'#1E7A53', background:'#E2F3EC', padding:'2px 9px', borderRadius:99 }}>Activo</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:11, fontWeight:800, color:t.primaryDark, textTransform:'uppercase', letterSpacing:0.4, margin:'14px 0 7px' }}>Registro de auditoría reciente</div>
          <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, overflow:'hidden' }}>
            {(()=>{ const log=lsGet('psico_audit_v1',[]); if(!log.length) return (
              <div style={{ padding:'16px', textAlign:'center', color:t.muted, fontSize:11.5 }}>Aún sin registros de auditoría. Se irán registrando los accesos y ediciones de fichas.</div>
            ); return log.slice(0,8).map((r,i)=>(
              <div key={i} style={{ display:'flex', gap:10, padding:'9px 14px', borderTop:i>0?`1px solid ${t.border}`:'none', fontSize:11 }}>
                <span style={{ color:t.muted, flexShrink:0, width:74, fontWeight:600 }}>{r[0]}</span>
                <span style={{ color:t.primary, fontWeight:700, flexShrink:0 }}>{r[1]}</span>
                <span style={{ color:t.ink }}>{r[2]}</span>
              </div>
            )); })()}
          </div>
        </div>
      )}

      {tab==='tendencia' && (
        <div className="fade">
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:4 }}>Tendencia del avance · mes a mes</div>
          <div style={{ fontSize:11, color:t.muted, marginBottom:14 }}>Evolución del % de documentos firmados a nivel colegio.</div>
          {TENDENCIA.length<2 ? (
            <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:26, textAlign:'center', color:t.muted, fontSize:12.5 }}>Aún no hay suficientes documentos firmados para mostrar una tendencia. Se irá construyendo a medida que se firmen planes.</div>
          ) : (<React.Fragment>
          <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'18px 16px' }}>
            <div style={{ display:'flex', alignItems:'flex-end', gap:14, height:170 }}>
              {TENDENCIA.map(([mes,pct])=>{ const tn=tono(pct); return (
                <div key={mes} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', height:'100%' }}>
                  <div style={{ fontSize:13, fontWeight:800, color:tn.c, marginBottom:5 }}>{pct}%</div>
                  <div style={{ width:'100%', maxWidth:54, height:`${pct}%`, background:tn.c, borderRadius:'8px 8px 0 0', transition:'height .5s' }} />
                  <div style={{ fontSize:11, color:t.muted, fontWeight:700, marginTop:7 }}>{mes}</div>
                </div>
              );})}
            </div>
          </div>
          {TENDENCIA.length>=2 && (()=>{ const delta=TENDENCIA[TENDENCIA.length-1][1]-TENDENCIA[0][1]; return (
          <div style={{ background:'#E8F0FB', border:'1px solid #BCD4F5', borderRadius:t.radius, padding:'12px 15px', marginTop:12, fontSize:11.5, color:'#2563B8', fontWeight:600 }}>
            ↗ {delta>=0?'+':''}{delta} puntos entre {TENDENCIA[0][0]} y {TENDENCIA[TENDENCIA.length-1][0]}.
          </div>
          ); })()}
          </React.Fragment>)}
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, margin:'18px 0 10px' }}>Comparativa entre ciclos</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {CICLOS_GESTION.map(c=>{ const ag=aggrega(GC.filter(r=>r.ciclo===c.id)); const tn=tono(ag.pct); return (
              <div key={c.id} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'12px 15px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}><span style={{ fontSize:12.5, fontWeight:700, color:t.ink }}>{c.nombre}</span><span style={{ color:tn.c, fontWeight:800, fontSize:12.5 }}>{ag.pct}%</span></div>
                <Barra pct={ag.pct} />
              </div>
            );})}
          </div>
        </div>
      )}
      {tab==='ciclos' && (
        <div className="fade" id="gestion-print">
          {CICLOS_GESTION.map(c=>{ const rows=GC.filter(r=>r.ciclo===c.id); const ag=aggrega(rows); const tn=tono(ag.pct); return (
            <div key={c.id} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:16, marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <div><div style={{ fontFamily:t.display, fontSize:16, fontWeight:700, color:t.ink }}>{c.nombre}</div><div style={{ fontSize:11, color:t.muted }}>{c.rango}</div></div>
                <div style={{ background:tn.bg, color:tn.c, fontSize:15, fontWeight:800, padding:'4px 14px', borderRadius:99 }}>{ag.pct}%</div>
              </div>
              {rows.map(r=>{ const tot=r.firmados+r.porFirmar; const p=tot?Math.round(r.firmados/tot*100):0; return (
                <div key={r.curso} style={{ display:'flex', alignItems:'center', gap:11, padding:'8px 0', borderTop:`1px solid ${t.border}` }}>
                  <div style={{ width:44, fontSize:12, fontWeight:700, color:t.ink }}>{r.curso}</div>
                  <div style={{ flex:1 }}><Barra pct={p} /></div>
                  <div style={{ fontSize:10.5, color:t.muted, width:120, textAlign:'right' }}>{r.firmados}/{tot} firmados</div>
                </div>
              );})}
            </div>
          );})}
        </div>
      )}

      {/* POR CURSO (tabla) */}
      {tab==='cursos' && (
        <div className="fade" id="gestion-print">
          <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 60px 60px 64px', gap:0, background:t.soft, padding:'10px 14px', fontSize:10.5, fontWeight:800, color:t.primaryDark, textTransform:'uppercase', letterSpacing:0.4 }}>
              <div>Curso</div><div style={{ textAlign:'center' }}>NEE</div><div style={{ textAlign:'center' }}>Firm.</div><div style={{ textAlign:'right' }}>Avance</div>
            </div>
            {GC.map((r,i)=>{ const tot=r.firmados+r.porFirmar; const p=tot?Math.round(r.firmados/tot*100):0; const tn=tono(p); return (
              <div key={r.curso} style={{ display:'grid', gridTemplateColumns:'1fr 60px 60px 64px', gap:0, padding:'10px 14px', borderTop:`1px solid ${t.border}`, alignItems:'center', fontSize:12 }}>
                <div style={{ fontWeight:700, color:t.ink }}>{r.curso}</div>
                <div style={{ textAlign:'center', color:t.muted }}>{r.nee}</div>
                <div style={{ textAlign:'center', color:t.muted }}>{r.firmados}/{tot}</div>
                <div style={{ textAlign:'right' }}><span style={{ background:tn.bg, color:tn.c, fontSize:11, fontWeight:800, padding:'2px 9px', borderRadius:99 }}>{p}%</span></div>
              </div>
            );})}
          </div>
        </div>
      )}

      {/* descargas */}
      <div style={{ display:'flex', gap:9, flexWrap:'wrap', marginTop:16 }}>
        <button onClick={()=>imprimirGestion(colegio)} style={{ flex:1, minWidth:120, padding:12, background:t.primary, color:'#fff', border:'none', borderRadius:12, fontSize:12.5, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}><Icon k="download" c="#fff" s={17} />PDF</button>
        <button onClick={()=>exportarExcel()} style={{ flex:1, minWidth:120, padding:12, background:'#1E7A53', color:'#fff', border:'none', borderRadius:12, fontSize:12.5, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}><Icon k="download" c="#fff" s={17} />Excel</button>
        <button onClick={()=>imprimirGestion(colegio)} style={{ flex:1, minWidth:120, padding:12, background:t.card, color:t.ink, border:`1px solid ${t.border}`, borderRadius:12, fontSize:12.5, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}><Icon k="print" c={t.ink} s={17} />Imprimir</button>
      </div>
      <button onClick={()=>imprimirExportColegio()} style={{ width:'100%', marginTop:9, padding:13, background:t.soft, color:t.primaryDark, border:`1px dashed ${t.primary}`, borderRadius:12, fontSize:12.5, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><Icon k="download" c={t.primary} s={17} />Exportar todos los expedientes del colegio</button>
      <div style={{ fontSize:10, color:t.muted, textAlign:'center', marginTop:6, lineHeight:1.4 }}>Garantía de portabilidad: descarga la información de todos los estudiantes, organizada por curso. Sus datos le pertenecen.</div>
    </div>
  );
}

// exporta a Excel (CSV con BOM, lo abre Excel directamente)
function exportarExcel(){
  auditPush('Gestión','exportó informe a Excel');
  const GC_EXP=gestionRowsReales();
  const filas=[['Curso','Estudiantes NEE','Firmados','Por firmar','Avance %']];
  GC_EXP.forEach(r=>{ const tot=r.firmados+r.porFirmar; filas.push([r.curso, r.nee, r.firmados, r.porFirmar, tot?Math.round(r.firmados/tot*100):0]); });
  const csv='\uFEFF'+filas.map(f=>f.join(';')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='Gestion_NEE_'+new Date().toISOString().slice(0,10)+'.csv'; a.click(); URL.revokeObjectURL(a.href);
}

// informe de gestión imprimible
function imprimirGestion(colegio){
  auditPush('Gestión','exportó / imprimió informe de gestión');
  const GC_EXP=gestionRowsReales();
  const DOCS_EXP=gestionDocsReales();
  const TEND_EXP=gestionTendenciaReal();
  const ADH_EXP=gestionAdherenciaReal();
  const esc=(s)=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const tn=(pct)=>pct>=80?'#1E7A53':pct>=50?'#2563B8':'#B23A24';
  const ciclosHTML=CICLOS_GESTION.map(c=>{ const ag=aggrega(GC_EXP.filter(r=>r.ciclo===c.id));
    return `<tr><td><b>${esc(c.nombre)}</b><br><span style="color:#666;font-size:9px">${esc(c.rango)}</span></td><td style="text-align:center">${ag.nee}</td><td style="text-align:center">${ag.firmados}</td><td style="text-align:center">${ag.porFirmar}</td><td style="text-align:center;color:${tn(ag.pct)};font-weight:700">${ag.pct}%</td></tr>`; }).join('');
  const cursosHTML=GC_EXP.map(r=>{ const tot=r.firmados+r.porFirmar; const p=tot?Math.round(r.firmados/tot*100):0;
    return `<tr><td>${esc(r.curso)}</td><td style="text-align:center">${r.nee}</td><td style="text-align:center">${r.firmados}/${tot}</td><td style="text-align:center;color:${tn(p)};font-weight:700">${p}%</td></tr>`; }).join('');
  const docsHTML=DOCS_EXP.map(d=>{ const p=d.total?Math.round(d.firmados/d.total*100):0;
    return `<tr><td><b>${esc(d.nombre)}</b><br><span style="color:#666;font-size:9px">${esc(d.full)}</span></td><td style="text-align:center">${d.firmados}/${d.total}</td><td style="text-align:center">${d.total-d.firmados}</td><td style="text-align:center;color:${tn(p)};font-weight:700">${p}%</td></tr>`; }).join('');
  const w=window.open('','_blank');
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Informe de Gestión · App Psicoeducativa</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#16302B;padding:34px 40px;font-size:11px}
    .hd{background:#1E5A4E;color:#fff;padding:18px 22px;border-radius:10px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center}
    .hd .t{font-size:18px;font-weight:700} .hd .s{font-size:11px;opacity:.8;margin-top:2px}
    .big{display:flex;gap:14px;margin-bottom:20px}
    .kpi{flex:1;border:1px solid #cfe0db;border-radius:10px;padding:14px 16px;text-align:center}
    .kpi .n{font-size:26px;font-weight:800} .kpi .l{font-size:10px;color:#666;margin-top:3px}
    h2{font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#1E5A4E;border-bottom:2px solid #DCEAE6;padding-bottom:5px;margin:18px 0 10px}
    table{width:100%;border-collapse:collapse;font-size:10.5px}
    th{background:#2C7A6B;color:#fff;padding:8px 10px;text-align:left;font-weight:600}
    th:first-child{border-radius:6px 0 0 0}th:last-child{border-radius:0 6px 0 0}
    td{padding:7px 10px;border-bottom:1px solid #e3ece9}
    .ft{margin-top:24px;text-align:center;font-size:8.5px;color:#999;border-top:1px solid #ddd;padding-top:8px}
    @media print{body{padding:14mm}}
  </style></head><body>
  <div class="hd"><div><div class="t">Informe de Gestión · NEE</div><div class="s">Colegio Mayor Peñalolén · ${new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'long',year:'numeric'})}</div></div><div style="font-size:30px;font-weight:800">${colegio.pct}%</div></div>
  <div class="big">
    <div class="kpi"><div class="n" style="color:#2C7A6B">${colegio.nee}</div><div class="l">Estudiantes con NEE</div></div>
    <div class="kpi"><div class="n" style="color:#1E7A53">${colegio.firmados}</div><div class="l">Documentos firmados</div></div>
    <div class="kpi"><div class="n" style="color:#B23A24">${colegio.porFirmar}</div><div class="l">Documentos por firmar</div></div>
    <div class="kpi"><div class="n">${colegio.total}</div><div class="l">Total documentos</div></div>
  </div>
  <h2>Avance por ciclo</h2>
  <table><thead><tr><th>Ciclo</th><th style="text-align:center">NEE</th><th style="text-align:center">Firmados</th><th style="text-align:center">Por firmar</th><th style="text-align:center">Avance</th></tr></thead><tbody>${ciclosHTML}</tbody></table>
  <h2>Avance por tipo de documento</h2>
  <table><thead><tr><th>Documento</th><th style="text-align:center">Firmados</th><th style="text-align:center">Por firmar</th><th style="text-align:center">Avance</th></tr></thead><tbody>${docsHTML}</tbody></table>
  <h2>Detalle por curso</h2>
  <table><thead><tr><th>Curso</th><th style="text-align:center">NEE</th><th style="text-align:center">Firmados</th><th style="text-align:center">Avance</th></tr></thead><tbody>${cursosHTML}</tbody></table>
  <h2>Tendencia del avance · mes a mes</h2>
  <table><thead><tr>${(TEND_EXP.length<2?[['—','']]:TEND_EXP).map(([m])=>`<th style="text-align:center">${m}</th>`).join('')}</tr></thead><tbody><tr>${(TEND_EXP.length<2?[['—','sin datos']]:TEND_EXP).map(([,p])=>`<td style="text-align:center;color:${tn(p||0)};font-weight:700">${TEND_EXP.length<2?'—':p+'%'}</td>`).join('')}</tr></tbody></table>
  <h2>Adherencia docente en aula</h2>
  <table><thead><tr><th>Curso</th><th style="text-align:center">Asignaturas que confirmaron</th><th style="text-align:center">Adherencia</th></tr></thead><tbody>${Object.keys(ADH_EXP).length===0?`<tr><td colspan="3" style="text-align:center;color:#666">Aún sin datos de adherencia docente</td></tr>`:Object.entries(ADH_EXP).map(([cur,v])=>{ const c=Array.isArray(v)?v[0]:0, m=Array.isArray(v)?v[1]:0; const p=m?Math.round(c/m*100):0; return `<tr><td>${esc(cur)}</td><td style="text-align:center">${c} de ${m}</td><td style="text-align:center;color:${tn(p)};font-weight:700">${p}%</td></tr>`; }).join('')}</tbody></table>
  <h2>Cumplimiento normativo</h2>
  <table><thead><tr><th>Indicador</th><th style="text-align:center">Cumplimiento</th></tr></thead><tbody>${(()=>{ const g=DOCS_EXP.filter(d=>d.id==='PAI'||d.id==='PACI'); const tot=g.reduce((a,d)=>a+d.total,0), fi=g.reduce((a,d)=>a+d.firmados,0); const d83=tot?Math.round(fi/tot*100):0; const pc=DOCS_EXP.find(d=>d.id==='PAEC'); const d67=pc&&pc.total?Math.round(pc.firmados/pc.total*100):0; const vig=colegio&&colegio.pct?colegio.pct:0; return [['Decreto 83/2015 · Diversificación de la enseñanza',d83],['Decreto 67/2018 · Evaluación y promoción',d67],['Planes con revisión vigente (al día)',vig]]; })().map(([l,p])=>`<tr><td>${esc(l)}</td><td style="text-align:center;color:${tn(p)};font-weight:700">${p}%</td></tr>`).join('')}</tbody></table>
  <div class="ft">Documento oficial · Colegio Mayor Peñalolén · Generado por App Psicoeducativa</div>
  <script>window.onload=function(){setTimeout(function(){window.print();},400);};<\/script>
  </body></html>`);
  w.document.close();
}

// ─── Control de accesibilidad (global) ──────────────────────────
function A11yControl({ a11y, setA11y, t, dark, setDark }){
  const [open,setOpen]=useState(false);
  return (
    <div style={{ position:'fixed', bottom:16, right:16, zIndex:300 }}>
      {open && (
        <div style={{ position:'absolute', bottom:54, right:0, width:220, background:dark?'#1B212B':'#fff', borderRadius:14, boxShadow:'0 10px 40px rgba(0,0,0,0.25)', padding:14, border:`1px solid ${t.border}` }} className="scale">
          <div style={{ fontSize:12.5, fontWeight:800, color:t.ink, marginBottom:10 }}>Accesibilidad</div>
          <div style={{ fontSize:11, fontWeight:700, color:t.muted, marginBottom:6 }}>Tamaño del texto</div>
          <div style={{ display:'flex', gap:6, marginBottom:12 }}>
            {[['A',0.9],['A',1],['A',1.15],['A',1.3]].map(([l,s],i)=>(
              <button key={i} onClick={()=>setA11y(p=>({...p,scale:s}))} style={{ flex:1, padding:'7px 0', borderRadius:8, cursor:'pointer', border:`1px solid ${a11y.scale===s?t.primary:t.border}`, background:a11y.scale===s?t.primary:(dark?'#252D39':'#fff'), color:a11y.scale===s?'#fff':t.ink, fontSize:10+i*2, fontWeight:800 }}>{l}</button>
            ))}
          </div>
          <button onClick={()=>setA11y(p=>({...p,contrast:!p.contrast}))} style={{ width:'100%', padding:'9px', borderRadius:9, cursor:'pointer', fontSize:11.5, fontWeight:700, border:`1px solid ${a11y.contrast?t.primary:t.border}`, background:a11y.contrast?t.primary:(dark?'#252D39':'#fff'), color:a11y.contrast?'#fff':t.ink, marginBottom:8 }}>
            {a11y.contrast?'✓ Alto contraste activo':'Activar alto contraste'}
          </button>
          {setDark && <button onClick={()=>setDark(d=>!d)} style={{ width:'100%', padding:'9px', borderRadius:9, cursor:'pointer', fontSize:11.5, fontWeight:700, border:`1px solid ${dark?t.primary:t.border}`, background:dark?t.primary:'#fff', color:dark?'#fff':t.ink }}>
            {dark?'☀ Modo claro':'🌙 Modo oscuro'}
          </button>}
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} title="Accesibilidad" style={{ width:46, height:46, borderRadius:'50%', background:t.primary, color:'#fff', border:'none', cursor:'pointer', boxShadow:'0 6px 20px rgba(0,0,0,0.25)', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>♿</button>
    </div>
  );
}

// ─── Copiloto IA conversacional (equipo) ────────────────────────
function mdClean(s){
  return String(s||'')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{20D0}-\u{20FF}\u{1F1E6}-\u{1F1FF}]/gu,'')
    .replace(/^#{1,6}\s*/gm,'')
    .replace(/\*\*(.*?)\*\*/g,'$1')
    .replace(/__(.*?)__/g,'$1')
    .replace(/(^|[^*])\*(?!\*)([^*\n]+?)\*(?!\*)/g,'$1$2')
    .replace(/`/g,'')
    .replace(/^\s*[-–—]{3,}\s*$/gm,'')
    .replace(/\n{3,}/g,'\n\n')
    .replace(/[ \t]+\n/g,'\n')
    .trim();
}
function CopilotoIA({ t }){
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState([{ rol:'ia', txt:'Hola. Soy tu copiloto psicoeducativo. Puedo ayudarte a redactar objetivos, resumir un informe, sugerir adecuaciones por diagnóstico o priorizar casos. ¿En qué trabajamos?' }]);
  const [input,setInput]=useState('');
  const [cargando,setCargando]=useState(false);
  const [alumno,setAlumno]=useState(()=> (typeof window!=='undefined' && window.__psicoStudentCtx) || null);
  const finRef=useRef(null);
  useEffect(()=>{ if(finRef.current) finRef.current.scrollTop=finRef.current.scrollHeight; },[msgs,cargando]);
  useEffect(()=>{ const h=()=>setAlumno(window.__psicoStudentCtx||null); window.addEventListener('psico-student',h); return ()=>window.removeEventListener('psico-student',h); },[]);

  const ctx = `Eres un asistente psicoeducativo experto del Colegio Mayor Peñalolén (Chile). Ayudas al equipo (educadoras diferenciales, psicólogas, terapeutas ocupacionales) con estudiantes con NEE. Conoces los documentos PAI, PACI, PAEC y Plan de Salud Mental, y la normativa chilena (Decreto 83/2015, Decreto 67/2018). Responde en español, conciso, práctico y cálido.\n\nFORMATO DE RESPUESTA: escribe en texto plano y limpio. NO uses markdown (nada de ###, **, ni líneas ---) ni emojis. Usa títulos en MAYÚSCULAS y listas con guion simple. Cuando te pidan completar o sugerir adecuaciones de un plan (PAI/PACI/PAEC/PSM), responde SIEMPRE usando las secciones y los ítems EXACTOS del plan abierto que se listan más abajo, agrupados por su sección, e indica para cada uno si conviene MARCARLO o no según el diagnóstico. No inventes ítems que no estén en esa lista, y NO agregues categorías propias (como "Ubicación", "Ambiente", "Tiempos"): usa únicamente los nombres de sección e ítems textuales del plan.`;
  const ctxPlan = (alumno && alumno.adec && alumno.adec.length) ? `\n\nESTRUCTURA EXACTA DEL PLAN ABIERTO (${alumno.planNombre||alumno.plan}). Usa estas secciones e ítems textuales al sugerir adecuaciones:\n`+alumno.adec.map(g=>`• ${g.tipo}\n`+g.items.map(it=>`   - ${it}`).join('\n')).join('\n') : '';
  const ctxInforme = alumno && alumno.informe ? (alumno.informe.tieneArchivo ? `\n\nINFORME MÉDICO: el estudiante tiene cargado el informe del especialista ("${alumno.informe.nombre}"). Cuando el usuario te pida leerlo o basar tus sugerencias en él, el archivo se adjunta a este mensaje (imagen o PDF) para que lo leas directamente. NUNCA respondas que no tienes acceso a archivos: si en este mensaje viene un archivo adjunto, léelo; si el usuario aún no lo ha pedido, ofrécele leerlo.` : `\n\nINFORME MÉDICO: figura un informe registrado pero sin archivo legible adjunto; pide al usuario que lo vuelva a subir desde la ficha si necesitas su contenido.`) : `\n\nINFORME MÉDICO: este estudiante aún no tiene informe del especialista cargado. Si te piden adecuaciones basadas en el diagnóstico, indícale que primero suba el informe en la ficha (o que te describa el diagnóstico).`;
  const ctxAlumno = alumno ? `\n\nESTUDIANTE ACTUALMENTE ABIERTO EN PANTALLA: ${alumno.nombre} (curso ${alumno.curso}${alumno.diag?', diagnóstico '+alumno.diag:''}).${alumno.plan?' Documento abierto: '+alumno.plan+'.':''}${alumno.resumen?' Síntesis del informe: '+alumno.resumen:''}\nSi el usuario pregunta por "este estudiante", "el/la estudiante" o no nombra a nadie, se refiere a ${alumno.nombre}. Basa tus respuestas en este estudiante salvo que el usuario nombre a otro.`+ctxInforme+ctxPlan : `\n\nNo hay ninguna ficha de estudiante abierta en este momento. Si el usuario pregunta por un estudiante específico, pídele que abra su ficha primero.`;
  const sugerencias = alumno
    ? [`Redacta 3 objetivos para ${alumno.nombre}`, `Sugiere adecuaciones para ${alumno.nombre}`, `Resume el caso de ${alumno.nombre}`]
    : ['Sugiere adecuaciones para un estudiante con TDAH','¿Qué casos debería priorizar esta semana?','¿Qué diferencia hay entre PAI y PACI?'];

  const [adjuntado,setAdjuntado]=useState(false);
  useEffect(()=>{ setAdjuntado(false); },[alumno&&alumno.estId]);
  const enviar=async(texto)=>{
    const q=(texto||input).trim(); if(!q||cargando) return;
    setInput(''); setMsgs(m=>[...m,{ rol:'user', txt:q }]); setCargando(true);
    try{
      const hist=msgs.slice(-6).map(m=>`${m.rol==='user'?'Usuario':'Asistente'}: ${m.txt}`).join('\n');
      const prompt=`${ctx}${ctxAlumno}\n\nConversación previa:\n${hist}\n\nUsuario: ${q}\n\nAsistente:`;
      // Adjunta el archivo real del informe médico si está disponible y aún no se envió
      let bloques=null;
      if(alumno && alumno.informe && alumno.informe.tieneArchivo && alumno.informe.rec && !adjuntado){
        try{
          const du=await informeDataUrl(alumno.informe.rec);
          const mm=/^data:([^;]+);base64,(.*)$/.exec(du||'');
          if(mm){
            const media=mm[1], datos=mm[2];
            const esPdf=/pdf/i.test(media);
            bloques=[{ type:'text', text:prompt+`\n\n(Se adjunta el informe médico de ${alumno.nombre} para que lo leas directamente.)` }, esPdf ? { type:'document', source:{ type:'base64', media_type:'application/pdf', data:datos } } : { type:'image', source:{ type:'base64', media_type:media, data:datos } }];
            setAdjuntado(true);
          }
        }catch(_){}
      }
      const content = bloques || prompt;
      const r=await window.claude.complete({ messages:[{ role:'user', content }] });
      setMsgs(m=>[...m,{ rol:'ia', txt:(r||'').trim()||'No pude generar respuesta, intenta de nuevo.' }]);
    }catch(e){ setMsgs(m=>[...m,{ rol:'ia', txt:'La IA está ocupada en este momento. Espera unos segundos y vuelve a intentarlo.' }]); }
    setCargando(false);
  };

  return (
    <div style={{ position:'fixed', bottom:16, right:74, zIndex:300 }}>
      {open && (
        <div style={{ position:'absolute', bottom:54, right:0, width:340, maxWidth:'92vw', height:480, maxHeight:'76vh', background:'#fff', borderRadius:16, boxShadow:'0 16px 50px rgba(0,0,0,0.3)', border:`1px solid ${t.border}`, display:'flex', flexDirection:'column', overflow:'hidden' }} className="scale">
          <div style={{ background:t.headerGrad, color:'#fff', padding:'13px 15px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon k="spark" c="#fff" s={16} /></div>
            <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:800 }}>Copiloto psicoeducativo</div><div style={{ fontSize:9.5, color:'rgba(255,255,255,0.7)' }}>Asistente IA · borrador, siempre revisa</div></div>
            <button onClick={()=>setOpen(false)} style={{ background:'none', border:'none', color:'#fff', fontSize:18, cursor:'pointer' }}>✕</button>
          </div>
          <div ref={finRef} style={{ flex:1, overflowY:'auto', padding:14, display:'flex', flexDirection:'column', gap:10, background:t.bg }}>
            {msgs.map((m,i)=>(
              <div key={i} style={{ alignSelf:m.rol==='user'?'flex-end':'flex-start', maxWidth:'85%', background:m.rol==='user'?t.primary:'#fff', color:m.rol==='user'?'#fff':t.ink, border:m.rol==='user'?'none':`1px solid ${t.border}`, borderRadius:13, padding:'9px 12px', fontSize:12, lineHeight:1.5, whiteSpace:'pre-wrap' }}>{m.rol==='ia'?mdClean(m.txt):m.txt}</div>
            ))}
            {cargando && <div style={{ alignSelf:'flex-start', background:'#fff', border:`1px solid ${t.border}`, borderRadius:13, padding:'9px 14px', fontSize:12, color:t.muted }}>Pensando…</div>}
            {msgs.length===1 && !cargando && (
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
                {sugerencias.map((s,i)=><button key={i} onClick={()=>enviar(s)} style={{ textAlign:'left', background:'#fff', border:`1px solid ${t.border}`, borderRadius:10, padding:'8px 11px', fontSize:11, color:t.primaryDark, cursor:'pointer', fontWeight:600 }}>{s}</button>)}
              </div>
            )}
          </div>
          <div style={{ padding:10, borderTop:`1px solid ${t.border}`, display:'flex', gap:7 }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') enviar(); }} placeholder="Escribe tu consulta…" style={{ flex:1, padding:'9px 12px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:12, outline:'none' }} />
            <button onClick={()=>enviar()} disabled={cargando} style={{ background:t.primary, color:'#fff', border:'none', borderRadius:10, padding:'0 14px', fontSize:15, fontWeight:700, cursor:'pointer' }}>↑</button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} title="Copiloto IA" style={{ display:'flex', alignItems:'center', gap:8, height:46, padding:'0 16px', borderRadius:99, background:t.headerGrad, color:'#fff', border:'none', cursor:'pointer', boxShadow:'0 6px 20px rgba(0,0,0,0.28)', fontSize:13, fontWeight:800 }}><Icon k="spark" c="#fff" s={17} />Copiloto</button>
    </div>
  );
}

// ════════════════ SALUD · TENS y RR.HH. ═════════════════════════
// Ficha de salud mínima por estudiante. Solo lo necesario para enfermería/RR.HH.:
// medicación (qué, dosis, horario, quién administra) y protocolo de desregulación.
// NO incluye informes clínicos completos ni el plan pedagógico.
// SALUD (medicación, alergias, contacto): lo registra y edita la TENS.
const SALUD_SEED = {
  e2: { medicamento:{ nombre:'Metilfenidato', dosis:'10 mg', horario:'08:00', via:'Oral', quien:'En el colegio · TENS', autoriza:'Receta Dr. Fuentes · Neurología (vigente)' }, alergias:'Sin alergias conocidas', contacto:{ nombre:'Carla Soto (madre)', fono:'+56 9 8712 4455' } },
  e3: { medicamento:{ nombre:'Sertralina', dosis:'50 mg', horario:'En casa (mañana)', via:'Oral', quien:'En el domicilio', autoriza:'Receta Dra. Herrera · Psiquiatría (vigente)' }, alergias:'Alergia a la penicilina', contacto:{ nombre:'Rodrigo Vera (padre)', fono:'+56 9 6231 7788' } },
  e1: { medicamento:null, alergias:'Sin alergias conocidas', contacto:{ nombre:'Paula Reyes (madre)', fono:'+56 9 5540 1122' } },
  e5: { medicamento:null, alergias:'Sin alergias conocidas', contacto:{ nombre:'Marcela Díaz (madre)', fono:'+56 9 9087 3321' } },
};
// DESREGULACIÓN (nivel, gatillantes, protocolo, lugar): la define el equipo psicoeducativo en el plan.
const DESREG_SEED = {
  e2:{ nivel:'medio', gatillantes:['Tiempos de espera largos','Cambios de actividad sin aviso'], protocolo:'Anticipar el cambio, ofrecer pausa activa breve, evitar confrontación. Si escala, avisar al equipo psicoeducativo.', lugar:'Rincón tranquilo del aula' },
  e3:{ nivel:'alto', gatillantes:['Evaluaciones','Situaciones sociales de exposición'], protocolo:'Ante crisis de ansiedad: acompañar a un espacio tranquilo, guiar respiración, no dejar sola. Avisar a psicología y al apoderado.', lugar:'Sala de calma / Enfermería' },
  e1:{ nivel:'medio', gatillantes:['Ruido intenso','Luces brillantes','Cambios de rutina'], protocolo:'Reducir estímulos, llevar a sala de calma con apoyo, respetar tiempo de autorregulación. Uso de audífonos si los porta.', lugar:'Sala de calma' },
  e5:{ nivel:'bajo', gatillantes:['Frustración ante tareas complejas'], protocolo:'Fraccionar la tarea, reforzar logros, dar apoyo verbal. Rara vez requiere contención.', lugar:'En el aula' },
};
const SALUD_NIVEL = { alto:{c:'#B23A24',bg:'#FBE6E2',lbl:'Riesgo alto'}, medio:{c:'#C2841E',bg:'#FCEFD9',lbl:'Atención'}, bajo:{c:'#1E7A53',bg:'#E2F3EC',lbl:'Estable'} };

function hoyStr(){ return new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'short',year:'numeric'}); }
// Registro de auditoría real: agrega una entrada [hora, actor, acción] (máx 30)
function auditPush(actor, accion){
  try{
    const log=JSON.parse(localStorage.getItem('psico_audit_v1')||'[]');
    const hh=new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'});
    log.unshift([`Hoy ${hh}`, actor, accion]);
    localStorage.setItem('psico_audit_v1', JSON.stringify(log.slice(0,30)));
  }catch(e){}
}
// Stores compartidos (persisten en el navegador durante la demo/pilotaje).
const SALUD_KEY='psico_salud_v1';
function saludLoad(){ try{ const s=JSON.parse(localStorage.getItem(SALUD_KEY)||'null'); return s||JSON.parse(JSON.stringify(SALUD_SEED)); }catch(e){ return JSON.parse(JSON.stringify(SALUD_SEED)); } }
function saludSave(d){ try{ localStorage.setItem(SALUD_KEY, JSON.stringify(d)); }catch(e){} window.dispatchEvent(new Event('salud-change')); }
function useSalud(){
  const [data,setData]=useState(saludLoad);
  useEffect(()=>{ const h=()=>setData(saludLoad()); window.addEventListener('salud-change',h); window.addEventListener('storage',h); return ()=>{ window.removeEventListener('salud-change',h); window.removeEventListener('storage',h); }; },[]);
  const set=(estId,rec)=>{ const d=saludLoad(); d[estId]={ ...(d[estId]||{}), ...rec, actualizado:hoyStr() }; saludSave(d); };
  return { data, set };
}
const DESREG_KEY='psico_desreg_v1';
function desregLoad(){ try{ const s=JSON.parse(localStorage.getItem(DESREG_KEY)||'null'); return s||JSON.parse(JSON.stringify(DESREG_SEED)); }catch(e){ return JSON.parse(JSON.stringify(DESREG_SEED)); } }
function desregSave(d){ try{ localStorage.setItem(DESREG_KEY, JSON.stringify(d)); }catch(e){} window.dispatchEvent(new Event('desreg-change')); }
function useDesreg(){
  const [data,setData]=useState(desregLoad);
  useEffect(()=>{ const h=()=>setData(desregLoad()); window.addEventListener('desreg-change',h); window.addEventListener('storage',h); return ()=>{ window.removeEventListener('desreg-change',h); window.removeEventListener('storage',h); }; },[]);
  const set=(estId,rec)=>{ const d=desregLoad(); d[estId]={ ...(d[estId]||{}), ...rec, actualizado:hoyStr() }; desregSave(d); };
  return { data, set };
}

function LabelVal({ t, label, value }){
  return (<div style={{ minWidth:0 }}><div style={{ fontSize:9.5, fontWeight:800, color:t.muted, textTransform:'uppercase', letterSpacing:0.5 }}>{label}</div><div style={{ fontSize:12.5, fontWeight:600, color:t.ink, marginTop:2 }}>{value}</div></div>);
}
function Inp({ t, ...p }){ return <input {...p} style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:12, outline:'none', background:t.card, color:t.ink }} />; }

// MEDICACIÓN — la registra la TENS (editable); el equipo la ve (solo lectura).
function MedFicha({ t, estId, editable }){
  const salud=useSalud();
  const rec=salud.data[estId]||{};
  const med=rec.medicamento||null;
  const [edit,setEdit]=useState(false);
  const [tiene,setTiene]=useState(!!med);
  const [f,setF]=useState(med||{ nombre:'', dosis:'', horario:'', via:'Oral', quien:'En el colegio · TENS', autoriza:'' });
  const [alg,setAlg]=useState(rec.alergias||'');
  const [cNom,setCNom]=useState((rec.contacto||{}).nombre||'');
  const [cFono,setCFono]=useState((rec.contacto||{}).fono||'');
  const abrir=()=>{ setTiene(!!med); setF(med||{ nombre:'', dosis:'', horario:'', via:'Oral', quien:'En el colegio · TENS', autoriza:'' }); setAlg(rec.alergias||''); setCNom((rec.contacto||{}).nombre||''); setCFono((rec.contacto||{}).fono||''); setEdit(true); };
  const guardar=()=>{ salud.set(estId,{ medicamento: tiene?f:null, alergias:alg, contacto:{ nombre:cNom, fono:cFono } }); setEdit(false); };
  return (
    <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:16, marginBottom:12 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <Icon k="pill" c={t.primary} s={17} /><span style={{ fontSize:12.5, fontWeight:800, color:t.ink }}>Medicación y salud</span>
        {!editable && <span style={{ fontSize:9.5, fontWeight:800, color:t.primaryDark, background:t.soft, padding:'2px 9px', borderRadius:99 }}>Registrado por TENS</span>}
        {editable && !edit && <button onClick={abrir} style={{ marginLeft:'auto', background:t.soft, color:t.primary, border:'none', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:700, cursor:'pointer' }}>{(med||rec.alergias)?'Editar':'Registrar'}</button>}
      </div>
      {!edit ? (
        <React.Fragment>
          {med ? (
            <div style={{ background:t.soft, borderRadius:12, padding:'12px 14px', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'11px 16px', marginBottom:10 }}>
              <LabelVal t={t} label="Medicamento" value={med.nombre} />
              <LabelVal t={t} label="Dosis" value={med.dosis} />
              <LabelVal t={t} label="Horario" value={med.horario} />
              <LabelVal t={t} label="Vía" value={med.via} />
              <LabelVal t={t} label="Administra" value={med.quien} />
              <LabelVal t={t} label="Autorización" value={med.autoriza} />
            </div>
          ) : (
            <div style={{ fontSize:12, color:t.muted, background:t.soft, borderRadius:12, padding:'11px 14px', marginBottom:10 }}>No requiere medicación en el colegio.</div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div style={{ background:t.soft, borderRadius:12, padding:'11px 14px' }}><LabelVal t={t} label="Alergias" value={rec.alergias||'—'} /></div>
            <div style={{ background:t.soft, borderRadius:12, padding:'11px 14px' }}><LabelVal t={t} label="Contacto de emergencia" value={(rec.contacto||{}).nombre||'—'} />{(rec.contacto||{}).fono && <div style={{ fontSize:12, fontWeight:700, color:t.primary, marginTop:3 }}>{rec.contacto.fono}</div>}</div>
          </div>
          {rec.actualizado && <div style={{ fontSize:10, color:t.muted, marginTop:9 }}>Actualizado por TENS · {rec.actualizado}</div>}
        </React.Fragment>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, fontWeight:700, color:t.ink, cursor:'pointer' }}><input type="checkbox" checked={tiene} onChange={e=>setTiene(e.target.checked)} />Toma medicamento</label>
          {tiene && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9 }}>
              <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:3 }}>Medicamento</div><Inp t={t} value={f.nombre} onChange={e=>setF({...f,nombre:e.target.value})} placeholder="Nombre" /></div>
              <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:3 }}>Dosis</div><Inp t={t} value={f.dosis} onChange={e=>setF({...f,dosis:e.target.value})} placeholder="10 mg" /></div>
              <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:3 }}>Horario</div><Inp t={t} value={f.horario} onChange={e=>setF({...f,horario:e.target.value})} placeholder="08:00" /></div>
              <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:3 }}>Vía</div><Inp t={t} value={f.via} onChange={e=>setF({...f,via:e.target.value})} placeholder="Oral" /></div>
              <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:3 }}>Administra</div><select value={f.quien} onChange={e=>setF({...f,quien:e.target.value})} style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:12, background:t.card, color:t.ink }}><option>En el colegio · TENS</option><option>En el domicilio</option></select></div>
              <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:3 }}>Autorización</div><Inp t={t} value={f.autoriza} onChange={e=>setF({...f,autoriza:e.target.value})} placeholder="Receta médica…" /></div>
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9 }}>
            <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:3 }}>Alergias</div><Inp t={t} value={alg} onChange={e=>setAlg(e.target.value)} placeholder="Sin alergias conocidas" /></div>
            <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:3 }}>Contacto de emergencia</div><Inp t={t} value={cNom} onChange={e=>setCNom(e.target.value)} placeholder="Nombre" /></div>
          </div>
          <div style={{ maxWidth:'50%' }}><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:3 }}>Teléfono</div><Inp t={t} value={cFono} onChange={e=>setCFono(e.target.value)} placeholder="+56 9 …" /></div>
          <div style={{ display:'flex', gap:8, marginTop:2 }}>
            <button onClick={guardar} style={{ background:t.primary, color:'#fff', border:'none', borderRadius:9, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Guardar</button>
            <button onClick={()=>setEdit(false)} style={{ background:t.soft, color:t.muted, border:'none', borderRadius:9, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// DESREGULACIÓN — la define el equipo (editable); la TENS la ve (solo lectura). Los gatillantes viven aquí y se reflejan en Salud.
function DesregFicha({ t, estId, editable }){
  const desreg=useDesreg();
  const d=desreg.data[estId]||null;
  const nv=SALUD_NIVEL[(d||{}).nivel]||SALUD_NIVEL.bajo;
  const [edit,setEdit]=useState(false);
  const [nivel,setNivel]=useState((d||{}).nivel||'bajo');
  const [gat,setGat]=useState(((d||{}).gatillantes||[]).slice());
  const [nuevoGat,setNuevoGat]=useState('');
  const [prot,setProt]=useState((d||{}).protocolo||'');
  const [lugar,setLugar]=useState((d||{}).lugar||'');
  const abrir=()=>{ setNivel((d||{}).nivel||'bajo'); setGat(((d||{}).gatillantes||[]).slice()); setProt((d||{}).protocolo||''); setLugar((d||{}).lugar||''); setNuevoGat(''); setEdit(true); };
  const addGat=()=>{ const v=nuevoGat.trim(); if(v){ setGat([...gat,v]); setNuevoGat(''); } };
  const guardar=()=>{ desreg.set(estId,{ nivel, gatillantes:gat, protocolo:prot, lugar }); setEdit(false); };
  return (
    <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:16, marginBottom:12 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, flexWrap:'wrap' }}>
        <Icon k="alert" c={nv.c} s={17} /><span style={{ fontSize:12.5, fontWeight:800, color:t.ink }}>Señales de desregulación y contención</span>
        {d && <span style={{ background:nv.bg, color:nv.c, fontSize:10, fontWeight:800, padding:'2px 9px', borderRadius:99 }}>{nv.lbl}</span>}
        {!editable && <span style={{ fontSize:9.5, fontWeight:800, color:t.primaryDark, background:t.soft, padding:'2px 9px', borderRadius:99 }}>Equipo psicoeducativo</span>}
        {editable && !edit && <button onClick={abrir} style={{ marginLeft:'auto', background:t.soft, color:t.primary, border:'none', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:700, cursor:'pointer' }}>{d?'Editar':'Definir'}</button>}
      </div>
      {!edit ? (
        d ? (
          <div style={{ background:t.soft, borderRadius:12, padding:'12px 14px' }}>
            <div style={{ fontSize:9.5, fontWeight:800, color:t.muted, textTransform:'uppercase', letterSpacing:0.5, marginBottom:5 }}>Gatillantes</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:11 }}>{(d.gatillantes||[]).length?d.gatillantes.map((g,i)=><span key={i} style={{ background:t.card, border:`1px solid ${t.border}`, color:t.ink, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:99 }}>{g}</span>):<span style={{ fontSize:11.5, color:t.muted }}>Sin registrar</span>}</div>
            <div style={{ fontSize:9.5, fontWeight:800, color:t.muted, textTransform:'uppercase', letterSpacing:0.5, marginBottom:4 }}>Qué hacer</div>
            <div style={{ fontSize:12.5, color:t.ink, lineHeight:1.5, marginBottom:9 }}>{d.protocolo||'—'}</div>
            <div style={{ fontSize:11.5, color:t.primaryDark, fontWeight:700 }}>Lugar de apoyo: {d.lugar||'—'}</div>
            {d.actualizado && <div style={{ fontSize:10, color:t.muted, marginTop:9 }}>Actualizado por el equipo · {d.actualizado}</div>}
          </div>
        ) : (
          <div style={{ fontSize:12, color:t.muted, background:t.soft, borderRadius:12, padding:'11px 14px' }}>Sin protocolo definido por el equipo psicoeducativo.</div>
        )
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
          <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:4 }}>Nivel de riesgo</div>
            <div style={{ display:'flex', gap:6 }}>{['bajo','medio','alto'].map(n=>{ const c=SALUD_NIVEL[n]; return <button key={n} onClick={()=>setNivel(n)} style={{ flex:1, padding:'8px 6px', fontSize:11, fontWeight:700, borderRadius:8, cursor:'pointer', border:`1px solid ${nivel===n?c.c:t.border}`, background:nivel===n?c.bg:t.card, color:nivel===n?c.c:t.muted }}>{c.lbl}</button>; })}</div>
          </div>
          <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:4 }}>Gatillantes</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:7 }}>{gat.map((g,i)=><span key={i} style={{ display:'inline-flex', alignItems:'center', gap:6, background:t.soft, color:t.ink, fontSize:11, fontWeight:600, padding:'3px 6px 3px 10px', borderRadius:99 }}>{g}<button onClick={()=>setGat(gat.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:t.muted, cursor:'pointer', fontSize:13, lineHeight:1 }}>×</button></span>)}</div>
            <div style={{ display:'flex', gap:7 }}><Inp t={t} value={nuevoGat} onChange={e=>setNuevoGat(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); addGat(); } }} placeholder="Agregar gatillante y Enter" /><button onClick={addGat} style={{ background:t.primary, color:'#fff', border:'none', borderRadius:8, padding:'0 14px', fontSize:14, fontWeight:700, cursor:'pointer', flexShrink:0 }}>＋</button></div>
          </div>
          <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:4 }}>Protocolo · qué hacer</div><textarea value={prot} onChange={e=>setProt(e.target.value)} rows={3} placeholder="Pasos de contención…" style={{ width:'100%', padding:'9px 11px', borderRadius:8, border:`1px solid ${t.border}`, fontSize:12, outline:'none', resize:'vertical', fontFamily:'inherit', background:t.card, color:t.ink }} /></div>
          <div><div style={{ fontSize:10, fontWeight:700, color:t.muted, marginBottom:4 }}>Lugar de apoyo</div><Inp t={t} value={lugar} onChange={e=>setLugar(e.target.value)} placeholder="Sala de calma…" /></div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={guardar} style={{ background:t.primary, color:'#fff', border:'none', borderRadius:9, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Guardar</button>
            <button onClick={()=>setEdit(false)} style={{ background:t.soft, color:t.muted, border:'none', borderRadius:9, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SaludDashboard({ t }){
  const [tab,setTab]=useState('estudiantes'); // estudiantes | medicacion
  const [busca,setBusca]=useState('');
  const [filtro,setFiltro]=useState('todos'); // todos | medicamento | desregulacion
  const [abierto,setAbierto]=useState(null);

  const salud=useSalud(); const desreg=useDesreg();
  const rosterSalud=[...ESTUDIANTES,...lsGet('psico_extra_v1',[])];
  const [nuevos,setNuevos]=useState([]);
  const [addBusca,setAddBusca]=useState('');
  const [agregando,setAgregando]=useState(false);
  const lista = rosterSalud.filter(e=> salud.data[e.id] || desreg.data[e.id] || nuevos.includes(e.id)).map(e=>({ e, med:(salud.data[e.id]||{}).medicamento||null, des:desreg.data[e.id]||null }));
  const conMed = lista.filter(x=>x.med);
  const conDesreg = lista.filter(x=>x.des && x.des.nivel!=='bajo');
  const q = busca.trim().toLowerCase();
  let visibles = lista;
  if(filtro==='medicamento') visibles = conMed;
  else if(filtro==='desregulacion') visibles = lista.filter(x=>x.des);
  if(q) visibles = visibles.filter(x=> x.e.nombre.toLowerCase().includes(q) || x.e.curso.toLowerCase().includes(q));
  const ordenN={alto:0,medio:1,bajo:2};
  visibles = visibles.slice().sort((a,b)=> (ordenN[(a.des||{}).nivel]??3) - (ordenN[(b.des||{}).nivel]??3));

  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'16px 16px 50px' }} className="fade">
      {/* Aviso de confidencialidad */}
      <div style={{ display:'flex', alignItems:'center', gap:12, background:t.soft, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'12px 15px', marginBottom:14 }}>
        <span style={{ width:34, height:34, borderRadius:10, background:t.card, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="lock" c={t.primary} s={18} /></span>
        <div style={{ fontSize:11, color:t.primaryDark, lineHeight:1.45 }}><b>Información de salud confidencial.</b> Acceso restringido a TENS y Recursos Humanos. Uso exclusivo para el cuidado del estudiante.</div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
        {[['Con ficha de salud', String(lista.length), 'salud'],['Con medicación', String(conMed.length), 'pill'],['Riesgo desregulación', String(conDesreg.length), 'alert']].map(([l,v,ic])=>(
          <div key={l} style={{ background:t.card, borderRadius:t.radius, border:`1px solid ${t.border}`, padding:'14px 15px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontFamily:t.display, fontSize:28, fontWeight:700, color:t.primary }}>{v}</div>
              <Icon k={ic} c={t.accent} s={20} />
            </div>
            <div style={{ fontSize:10.5, color:t.muted, marginTop:2, lineHeight:1.25 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* subpestañas */}
      <div style={{ display:'flex', gap:5, background:t.soft, padding:4, borderRadius:12, marginBottom:14 }}>
        {[['estudiantes','Estudiantes'],['medicacion','Medicación del día']].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:'9px 6px', fontSize:12, fontWeight:700, borderRadius:9, border:'none', cursor:'pointer',
            background: tab===id?t.card:'transparent', color: tab===id?t.primary:t.muted, boxShadow: tab===id?'0 1px 4px rgba(0,0,0,0.08)':'none', transition:'all .15s' }}>{label}</button>
        ))}
      </div>

      {tab==='estudiantes' && (
        <div className="fade">
          {/* Alta de registro para cualquier alumno del roster */}
          <div style={{ marginBottom:12 }}>
            {!agregando ? (
              <button onClick={()=>setAgregando(true)} style={{ width:'100%', padding:'11px 14px', background:t.card, color:t.primaryDark, border:`1.5px dashed ${t.primary}`, borderRadius:11, fontSize:12.5, fontWeight:700, cursor:'pointer' }}>＋ Agregar registro de salud a un estudiante</button>
            ) : (
              <div style={{ background:t.card, border:`1px solid ${t.primary}`, borderRadius:t.radius, padding:14 }} className="slide">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ fontSize:12.5, fontWeight:800, color:t.ink }}>Buscar estudiante en la nómina</div>
                  <button onClick={()=>{ setAgregando(false); setAddBusca(''); }} style={{ background:'none', border:'none', fontSize:16, color:t.muted, cursor:'pointer' }}>✕</button>
                </div>
                <input value={addBusca} onChange={e=>setAddBusca(e.target.value)} placeholder="Nombre o curso…" style={{ width:'100%', padding:'10px 13px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:13, outline:'none', marginBottom:10, background:t.card, color:t.ink }} />
                {addBusca.trim() ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:7, maxHeight:260, overflowY:'auto' }}>
                    {rosterSalud.filter(e=> !(salud.data[e.id]||desreg.data[e.id]||nuevos.includes(e.id)) && (e.nombre+' '+e.curso).toLowerCase().includes(addBusca.trim().toLowerCase())).slice(0,30).map(e=>(
                      <button key={e.id} onClick={()=>{ setNuevos(p=>[...p,e.id]); setAbierto(e.id); setAgregando(false); setAddBusca(''); }} style={{ textAlign:'left', cursor:'pointer', background:t.soft, border:`1px solid ${t.border}`, borderRadius:10, padding:'10px 12px', display:'flex', alignItems:'center', gap:11 }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:t.card, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:t.primaryDark, fontFamily:t.display, flexShrink:0, fontSize:12 }}>{e.nombre.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
                        <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13, fontWeight:700, color:t.ink }}>{e.nombre}</div><div style={{ fontSize:11, color:t.muted }}>{e.curso}</div></div>
                        <span style={{ flexShrink:0, color:t.primary, fontSize:12, fontWeight:800 }}>＋</span>
                      </button>
                    ))}
                    {rosterSalud.filter(e=> !(salud.data[e.id]||desreg.data[e.id]||nuevos.includes(e.id)) && (e.nombre+' '+e.curso).toLowerCase().includes(addBusca.trim().toLowerCase())).length===0 && <div style={{ textAlign:'center', color:t.muted, fontSize:12, padding:16 }}>Sin resultados en la nómina.</div>}
                  </div>
                ) : <div style={{ textAlign:'center', color:t.muted, fontSize:11.5, padding:12 }}>Escribe para buscar en la nómina cargada.</div>}
              </div>
            )}
          </div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por nombre o curso…" style={{ width:'100%', padding:'10px 13px', borderRadius:10, border:`1px solid ${t.border}`, fontSize:13, outline:'none', marginBottom:10, background:t.card, color:t.ink }} />
          <div style={{ display:'flex', gap:7, marginBottom:14, flexWrap:'wrap' }}>
            {[['todos','Todos'],['medicamento','Toman medicamento'],['desregulacion','Con protocolo']].map(([id,label])=>(
              <button key={id} onClick={()=>setFiltro(id)} style={{ padding:'7px 13px', fontSize:11.5, fontWeight:700, borderRadius:99, cursor:'pointer',
                border:`1px solid ${filtro===id?t.primary:t.border}`, background: filtro===id?t.primary:t.card, color: filtro===id?'#fff':t.muted }}>{label}</button>
            ))}
          </div>
          {visibles.length===0 ? (
            <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:30, textAlign:'center', color:t.muted, fontSize:12.5 }}>Sin estudiantes para este filtro.</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {visibles.map(({e,med,des})=>{
                const nv = SALUD_NIVEL[(des||{}).nivel]||SALUD_NIVEL.bajo;
                const open = abierto===e.id;
                return (
                  <div key={e.id} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, overflow:'hidden' }}>
                    <button onClick={()=>setAbierto(open?null:e.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'13px 15px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
                      <div style={{ width:42, height:42, borderRadius:12, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="salud" c={t.primary} s={22} /></div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13.5, fontWeight:700, color:t.ink }}>{e.nombre}</div>
                        <div style={{ fontSize:11, color:t.muted, marginTop:1 }}>{e.curso} · {e.edad}</div>
                      </div>
                      <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0, flexWrap:'wrap', justifyContent:'flex-end' }}>
                        {med && <Chip t={t} label="Medicamento" tone="alert" />}
                        {des && <span style={{ background:nv.bg, color:nv.c, fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99 }}>{nv.lbl}</span>}
                      </div>
                    </button>
                    {open && (
                      <div style={{ borderTop:`1px solid ${t.border}`, padding:'14px 15px 4px' }} className="fade">
                        <MedFicha t={t} estId={e.id} editable />
                        <DesregFicha t={t} estId={e.id} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab==='medicacion' && (
        <div className="fade">
          <div style={{ fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:4 }}>Medicación del día</div>
          <div style={{ fontSize:11, color:t.muted, marginBottom:14 }}>Estudiantes con medicación indicada. Los administrados en el colegio requieren registro de la TENS.</div>
          {conMed.length===0 ? (
            <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:30, textAlign:'center', color:t.muted, fontSize:12.5 }}>Ningún estudiante requiere medicación.</div>
          ) : (
            <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, overflow:'hidden' }}>
              {conMed.slice().sort((a,b)=>String(a.med.horario).localeCompare(String(b.med.horario))).map(({e,med},i)=>{
                const enColegio = /colegio/i.test(med.quien);
                return (
                  <div key={e.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 15px', borderTop:i>0?`1px solid ${t.border}`:'none' }}>
                    <div style={{ width:40, height:40, borderRadius:11, background:t.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon k="pill" c={t.primary} s={20} /></div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:t.ink }}>{e.nombre} <span style={{ color:t.muted, fontWeight:500 }}>· {e.curso}</span></div>
                      <div style={{ fontSize:11.5, color:t.muted, marginTop:1 }}>{med.nombre} · {med.dosis} · {med.via}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5, justifyContent:'flex-end', fontSize:12.5, fontWeight:800, color:t.ink }}><Icon k="clock" c={t.muted} s={14} />{med.horario}</div>
                      <span style={{ display:'inline-block', marginTop:4, background: enColegio?'#FBE6E2':t.soft, color: enColegio?'#B23A24':t.primaryDark, fontSize:10, fontWeight:800, padding:'2px 9px', borderRadius:99 }}>{enColegio?'Administra TENS':'En casa'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Onboarding, Login, AppHeader, EquipoDashboard, ProfesorDashboard, ApoderadoDashboard, GestionDashboard, SaludDashboard, A11yControl, CopilotoIA });
