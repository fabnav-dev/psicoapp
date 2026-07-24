// ═══════════ SALA DE NEUROBIENESTAR · módulo del Equipo Psicoeducativo ═══════════
// Registro de visitas + bitácora + 7 indicadores. Datos en psico_sala_v1 (sincroniza en la nube).
const { useState:useStateS, useEffect:useEffectS, useMemo:useMemoS } = React;
const _lg=(k,fb)=>{ try{ const v=localStorage.getItem(k); return v!=null?JSON.parse(v):fb; }catch(e){ return fb; } };
const _ls=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
const _nc=(c)=>String(c||'').replace(/\s*B[áa]sico|\s*Medio/i,'').replace(/\s/g,'');
const _ciclo=(code)=>{ const g=String(code||'').replace(/[A-E]$/,''); if(['PK','K','1°','2°'].includes(g)) return 'Primer Ciclo'; if(['3°','4°','5°','6°'].includes(g)) return 'Segundo Ciclo'; return 'Ciclo Superior'; };

const SALA_MOTIVOS = ['Desregulación / Crisis en aula o patio','Sobrecarga sensorial','Ansiedad / Angustia','Prevención / Pausa regulada','Derivación del equipo','Conflicto interpersonal','Otro'];
const SALA_ESTADOS = ['Desregulado / Alerta Alta','Alerta Modulada / Basal','Regulado / Alerta Óptima'];
const SALA_MATERIALES = ['Columpios','Tabla de equilibrio','Piscina de pelotas','Carpa tipi','Mesa sensorial','Arena mágica','Material de respiración','Peso / manta','Rincón oscuro','Música / sonido'];
const SALA_EST_COL = { 'Desregulado / Alerta Alta':'#C2410C', 'Alerta Modulada / Basal':'#B8860B', 'Regulado / Alerta Óptima':'#1E7A53' };

function useSala(){
  const [data,setData]=useStateS(()=>_lg('psico_sala_v1',[]));
  useEffectS(()=>{ const h=()=>setData(_lg('psico_sala_v1',[])); window.addEventListener('sala-change',h); window.addEventListener('storage',h); return ()=>{ window.removeEventListener('sala-change',h); window.removeEventListener('storage',h); }; },[]);
  const add=(rec)=>{ const arr=[{ id:'s'+Date.now(), ...rec }, ..._lg('psico_sala_v1',[])]; _ls('psico_sala_v1',arr); setData(arr); window.dispatchEvent(new Event('sala-change')); };
  const del=(id)=>{ const arr=_lg('psico_sala_v1',[]).filter(r=>r.id!==id); _ls('psico_sala_v1',arr); setData(arr); window.dispatchEvent(new Event('sala-change')); };
  return { data, add, del };
}
function minutosEntre(hi,hf){ if(!hi||!hf) return ''; const [a,b]=hi.split(':').map(Number); const [c,d]=hf.split(':').map(Number); let m=(c*60+d)-(a*60+b); if(m<0) m+=1440; return m; }
function mesCorto(fecha){ const M=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']; const d=new Date(fecha+'T00:00'); return isNaN(d)?'—':M[d.getMonth()]; }

// ── Gráfico de barras horizontal reutilizable ──
function BarrasH({ t, datos, color }){
  const max=Math.max(1,...datos.map(d=>d.v));
  if(!datos.length) return <div style={{ fontSize:11.5, color:t.muted, fontStyle:'italic', padding:'8px 2px' }}>Sin datos aún.</div>;
  return (<div style={{ display:'flex', flexDirection:'column', gap:8 }}>
    {datos.map((d,i)=>(
      <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:'42%', fontSize:11, color:t.ink, textAlign:'right', lineHeight:1.25 }}>{d.l}</div>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:7 }}>
          <div style={{ height:16, width:`${Math.max(6,d.v/max*100)}%`, background:d.c||color, borderRadius:5, transition:'width .4s' }} />
          <span style={{ fontSize:11, fontWeight:800, color:t.ink }}>{d.v}</span>
        </div>
      </div>
    ))}
  </div>);
}
function ColBar({ t, datos, color }){ // vertical bars (evolución mensual)
  const max=Math.max(1,...datos.map(d=>d.v));
  if(!datos.length) return <div style={{ fontSize:11.5, color:t.muted, fontStyle:'italic', padding:'8px 2px' }}>Sin datos aún.</div>;
  return (<div style={{ display:'flex', alignItems:'flex-end', gap:8, height:150 }}>
    {datos.map((d,i)=>(
      <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', height:'100%' }}>
        <div style={{ fontSize:11, fontWeight:800, color:color, marginBottom:4 }}>{d.v||''}</div>
        <div style={{ width:'100%', maxWidth:40, height:`${Math.max(3,d.v/max*100)}%`, background:color, borderRadius:'6px 6px 0 0', transition:'height .4s' }} />
        <div style={{ fontSize:10, color:t.muted, fontWeight:700, marginTop:6 }}>{d.l}</div>
      </div>
    ))}
  </div>);
}
function Panel({ t, titulo, children }){
  return (<div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'14px 16px', marginBottom:12 }}>
    <div style={{ fontSize:12, fontWeight:800, color:t.ink, marginBottom:12 }}>{titulo}</div>
    {children}
  </div>);
}

function SalaNeurobienestar({ t, roster }){
  const sala=useSala();
  const [sub,setSub]=useStateS('registro'); // registro | bitacora | indicadores
  const hoy=new Date().toISOString().slice(0,10);
  const vacio={ fecha:hoy, estId:'', estNombre:'', curso:'', ciclo:'', hi:'', hf:'', motivo:SALA_MOTIVOS[0], motivoOtro:'', ei:SALA_ESTADOS[1], obs:'', ef:SALA_ESTADOS[2], mats:[], profesional:'' };
  const [f,setF]=useStateS(vacio);
  const [buscaEst,setBuscaEst]=useStateS('');
  const [filtroCurso,setFiltroCurso]=useStateS('');
  const [toast,setToast]=useStateS('');
  const show=(m)=>{ setToast(m); setTimeout(()=>setToast(''),2400); };
  const mins=minutosEntre(f.hi,f.hf);

  const pickEst=(e)=>{ setF(p=>({ ...p, estId:e.id, estNombre:e.nombre, curso:_nc(e.curso), ciclo:_ciclo(_nc(e.curso)) })); setBuscaEst(''); };
  const toggleMat=(m)=>setF(p=>({ ...p, mats: p.mats.includes(m)? p.mats.filter(x=>x!==m):[...p.mats,m] }));
  const guardar=()=>{ if(!f.estId){ show('Elige el estudiante'); return; } if(!f.hi||!f.hf){ show('Indica hora de ingreso y salida'); return; }
    sala.add({ ...f, motivo: f.motivo==='Otro'? (f.motivoOtro||'Otro') : f.motivo, minutos: mins||0 });
    setF({ ...vacio, fecha:f.fecha }); show('✓ Visita registrada'); setSub('bitacora'); };

  const visibles = useMemoS(()=> sala.data.filter(r=> !filtroCurso || r.curso===filtroCurso), [sala.data, filtroCurso]);
  const cursosCon = [...new Set(sala.data.map(r=>r.curso))].sort();

  // ── indicadores ──
  const ind = useMemoS(()=>{
    const d=sala.data;
    const porMes={}; d.forEach(r=>{ const m=mesCorto(r.fecha); porMes[m]=(porMes[m]||0)+1; });
    const ORD=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const evol=ORD.filter(m=>porMes[m]).map(m=>({ l:m, v:porMes[m] }));
    const cnt=(key)=>{ const o={}; d.forEach(r=>{ const k=r[key]||'—'; o[k]=(o[k]||0)+1; }); return o; };
    const ciclos=Object.entries(cnt('ciclo')).map(([l,v])=>({ l, v }));
    const matO={}; d.forEach(r=>(r.mats||[]).forEach(m=>{ matO[m]=(matO[m]||0)+1; })); const mats=Object.entries(matO).sort((a,b)=>b[1]-a[1]).map(([l,v])=>({ l, v }));
    const buckets={ '0–10 min':0,'11–20 min':0,'21–30 min':0,'+30 min':0 }; d.forEach(r=>{ const m=r.minutos||0; if(m<=10)buckets['0–10 min']++; else if(m<=20)buckets['11–20 min']++; else if(m<=30)buckets['21–30 min']++; else buckets['+30 min']++; }); const tiempo=Object.entries(buckets).map(([l,v])=>({ l, v }));
    const prof=Object.entries(cnt('profesional')).sort((a,b)=>b[1]-a[1]).map(([l,v])=>({ l, v }));
    const estO={}; d.forEach(r=>{ estO[r.estNombre]=(estO[r.estNombre]||0)+1; }); const topEst=Object.entries(estO).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([l,v])=>({ l, v }));
    const motivos=Object.entries(cnt('motivo')).sort((a,b)=>b[1]-a[1]).map(([l,v])=>({ l, v }));
    const totMin=d.reduce((a,r)=>a+(r.minutos||0),0);
    return { evol, ciclos, mats, tiempo, prof, topEst, motivos, total:d.length, prom: d.length?Math.round(totMin/d.length):0 };
  },[sala.data]);

  const inputS={ width:'100%', padding:'9px 11px', borderRadius:9, border:`1px solid ${t.border}`, fontSize:12.5, outline:'none', background:t.card, color:t.ink };
  const lbl={ fontSize:10.5, fontWeight:800, color:t.muted, textTransform:'uppercase', letterSpacing:0.4, marginBottom:5, display:'block' };

  return (
    <div className="fade">
      <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:6 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:t.primary+'1a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 }}>🌿</div>
        <div><div style={{ fontFamily:t.display, fontSize:18, fontWeight:700, color:t.ink }}>Sala de Neurobienestar</div>
          <div style={{ fontSize:11, color:t.muted }}>Registro de uso y acompañamiento · {ind.total} visita{ind.total!==1?'s':''}</div></div>
      </div>
      <div style={{ display:'flex', gap:5, background:t.soft, padding:4, borderRadius:12, margin:'12px 0 14px' }}>
        {[['registro','Registrar visita'],['bitacora','Bitácora'],['indicadores','Indicadores']].map(([id,l])=>(
          <button key={id} onClick={()=>setSub(id)} style={{ flex:1, padding:'9px 6px', fontSize:12, fontWeight:700, borderRadius:9, border:'none', cursor:'pointer', background:sub===id?t.card:'transparent', color:sub===id?t.primary:t.muted, boxShadow:sub===id?'0 1px 4px rgba(0,0,0,0.08)':'none' }}>{l}</button>
        ))}
      </div>

      {sub==='registro' && (
        <div className="fade" style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:16 }}>
          {/* estudiante */}
          <label style={lbl}>Estudiante</label>
          {f.estId ? (
            <div style={{ display:'flex', alignItems:'center', gap:10, background:t.soft, borderRadius:9, padding:'9px 12px', marginBottom:12 }}>
              <div style={{ flex:1 }}><b style={{ fontSize:13, color:t.ink }}>{f.estNombre}</b><span style={{ fontSize:11, color:t.muted }}> · {f.curso} · {f.ciclo}</span></div>
              <button onClick={()=>setF(p=>({ ...p, estId:'', estNombre:'', curso:'', ciclo:'' }))} style={{ background:'none', border:'none', color:t.muted, cursor:'pointer', fontSize:15 }}>✕</button>
            </div>
          ) : (
            <div style={{ marginBottom:12 }}>
              <input value={buscaEst} onChange={e=>setBuscaEst(e.target.value)} placeholder="Buscar por nombre o curso…" style={inputS} />
              {buscaEst.trim() && (
                <div style={{ marginTop:6, maxHeight:190, overflowY:'auto', border:`1px solid ${t.border}`, borderRadius:9 }}>
                  {roster.filter(e=>(e.nombre+' '+e.curso).toLowerCase().includes(buscaEst.trim().toLowerCase())).slice(0,25).map(e=>(
                    <button key={e.id} onClick={()=>pickEst(e)} style={{ width:'100%', textAlign:'left', background:'none', border:'none', borderBottom:`1px solid ${t.border}`, padding:'9px 12px', cursor:'pointer', fontSize:12.5, color:t.ink }}>{e.nombre} <span style={{ color:t.muted }}>· {_nc(e.curso)}</span></button>
                  ))}
                  {roster.filter(e=>(e.nombre+' '+e.curso).toLowerCase().includes(buscaEst.trim().toLowerCase())).length===0 && <div style={{ padding:'10px 12px', fontSize:11.5, color:t.muted }}>Sin resultados en la nómina.</div>}
                </div>
              )}
            </div>
          )}
          {/* fecha / horas / tiempo */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:9, marginBottom:12 }}>
            <div><label style={lbl}>Fecha</label><input type="date" value={f.fecha} onChange={e=>setF(p=>({...p,fecha:e.target.value}))} style={inputS} /></div>
            <div><label style={lbl}>Ingreso</label><input type="time" value={f.hi} onChange={e=>setF(p=>({...p,hi:e.target.value}))} style={inputS} /></div>
            <div><label style={lbl}>Salida</label><input type="time" value={f.hf} onChange={e=>setF(p=>({...p,hf:e.target.value}))} style={inputS} /></div>
            <div><label style={lbl}>Tiempo</label><div style={{ ...inputS, background:t.soft, fontWeight:800, color:t.primary }}>{mins!==''?mins+' min':'—'}</div></div>
          </div>
          {/* motivo */}
          <label style={lbl}>Motivo de ingreso / Criterio de derivación</label>
          <select value={f.motivo} onChange={e=>setF(p=>({...p,motivo:e.target.value}))} style={{ ...inputS, marginBottom: f.motivo==='Otro'?7:12 }}>{SALA_MOTIVOS.map(m=><option key={m}>{m}</option>)}</select>
          {f.motivo==='Otro' && <input value={f.motivoOtro} onChange={e=>setF(p=>({...p,motivoOtro:e.target.value}))} placeholder="Especifica el motivo" style={{ ...inputS, marginBottom:12 }} />}
          {/* estados */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9, marginBottom:12 }}>
            <div><label style={lbl}>Estado inicial</label><select value={f.ei} onChange={e=>setF(p=>({...p,ei:e.target.value}))} style={inputS}>{SALA_ESTADOS.map(m=><option key={m}>{m}</option>)}</select></div>
            <div><label style={lbl}>Estado final</label><select value={f.ef} onChange={e=>setF(p=>({...p,ef:e.target.value}))} style={inputS}>{SALA_ESTADOS.map(m=><option key={m}>{m}</option>)}</select></div>
          </div>
          {/* observación */}
          <label style={lbl}>Observación breve (contexto de uso)</label>
          <textarea value={f.obs} onChange={e=>setF(p=>({...p,obs:e.target.value}))} rows={2} placeholder="Contexto, comportamiento, evolución durante la visita…" style={{ ...inputS, resize:'vertical', marginBottom:12 }} />
          {/* materiales */}
          <label style={lbl}>Materiales utilizados</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
            {SALA_MATERIALES.map(m=>{ const on=f.mats.includes(m); return (
              <button key={m} onClick={()=>toggleMat(m)} style={{ padding:'6px 11px', borderRadius:99, border:`1px solid ${on?t.primary:t.border}`, background:on?t.primary:t.card, color:on?'#fff':t.ink, fontSize:11, fontWeight:700, cursor:'pointer' }}>{m}</button>
            );})}
          </div>
          {/* profesional */}
          <label style={lbl}>Profesional del equipo que acompaña</label>
          <input value={f.profesional} onChange={e=>setF(p=>({...p,profesional:e.target.value}))} placeholder="Nombre del profesional" style={{ ...inputS, marginBottom:16 }} />
          <button onClick={guardar} style={{ width:'100%', padding:12, background:t.primary, color:'#fff', border:'none', borderRadius:11, fontSize:13, fontWeight:800, cursor:'pointer' }}>Registrar visita</button>
        </div>
      )}

      {sub==='bitacora' && (
        <div className="fade">
          <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap', alignItems:'center' }}>
            <select value={filtroCurso} onChange={e=>setFiltroCurso(e.target.value)} style={{ ...inputS, width:'auto', flex:'0 0 auto' }}>
              <option value="">Todos los cursos</option>{cursosCon.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <span style={{ fontSize:11.5, color:t.muted }}>{visibles.length} registro{visibles.length!==1?'s':''}</span>
            <button onClick={()=>imprimirSala(sala.data)} style={{ marginLeft:'auto', background:t.soft, color:t.primaryDark, border:`1px solid ${t.border}`, borderRadius:9, padding:'8px 13px', fontSize:11.5, fontWeight:700, cursor:'pointer' }}>Descargar bitácora (PDF)</button>
          </div>
          {visibles.length===0 ? (
            <div style={{ background:t.card, border:`1px dashed ${t.border}`, borderRadius:t.radius, padding:26, textAlign:'center', color:t.muted, fontSize:12.5 }}>Aún no hay visitas registradas.</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {visibles.map(r=>(
                <div key={r.id} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'12px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <b style={{ fontSize:13, color:t.ink }}>{r.estNombre}</b>
                    <span style={{ fontSize:11, color:t.muted }}>· {r.curso}</span>
                    <span style={{ marginLeft:'auto', fontSize:11, fontWeight:800, color:t.primary }}>{r.minutos} min</span>
                    <button onClick={()=>sala.del(r.id)} title="Eliminar" style={{ background:'none', border:'none', color:t.muted, cursor:'pointer', fontSize:13 }}>🗑</button>
                  </div>
                  <div style={{ fontSize:11, color:t.muted, marginBottom:8 }}>{r.fecha} · {r.hi}–{r.hf} · {r.profesional||'Sin profesional'}</div>
                  <div style={{ fontSize:11.5, color:t.ink, marginBottom:8 }}><b style={{ color:t.primaryDark }}>Motivo:</b> {r.motivo}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                    <span style={{ fontSize:10.5, fontWeight:800, color:'#fff', background:SALA_EST_COL[r.ei]||t.muted, padding:'2px 9px', borderRadius:99 }}>{r.ei}</span>
                    <span style={{ color:t.muted }}>→</span>
                    <span style={{ fontSize:10.5, fontWeight:800, color:'#fff', background:SALA_EST_COL[r.ef]||t.muted, padding:'2px 9px', borderRadius:99 }}>{r.ef}</span>
                  </div>
                  {(r.mats||[]).length>0 && <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom: r.obs?8:0 }}>{r.mats.map(m=><span key={m} style={{ fontSize:10, color:t.primaryDark, background:t.soft, padding:'2px 8px', borderRadius:6 }}>{m}</span>)}</div>}
                  {r.obs && <div style={{ fontSize:11.5, color:t.ink, background:t.soft, borderRadius:8, padding:'8px 10px', lineHeight:1.45 }}>{r.obs}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {sub==='indicadores' && (
        <div className="fade">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
            {[['Visitas totales', ind.total],['Tiempo promedio', ind.prom+' min']].map(([l,v])=>(
              <div key={l} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:t.radius, padding:'13px 16px' }}>
                <div style={{ fontFamily:t.display, fontSize:26, fontWeight:700, color:t.primary }}>{v}</div>
                <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:10 }}>
            <button onClick={()=>imprimirSala(sala.data)} style={{ background:t.soft, color:t.primaryDark, border:`1px solid ${t.border}`, borderRadius:9, padding:'8px 13px', fontSize:11.5, fontWeight:700, cursor:'pointer' }}>Descargar informe (PDF)</button>
          </div>
          <Panel t={t} titulo="Evolución de ingresos por mes"><ColBar t={t} datos={ind.evol} color={t.primary} /></Panel>
          <Panel t={t} titulo="Uso de la sala por ciclo escolar"><BarrasH t={t} datos={ind.ciclos} color="#2563B8" /></Panel>
          <Panel t={t} titulo="Motivos de ingreso"><BarrasH t={t} datos={ind.motivos} color="#7A4FB0" /></Panel>
          <Panel t={t} titulo="Materiales y herramientas más utilizados"><BarrasH t={t} datos={ind.mats} color="#1B9E8A" /></Panel>
          <Panel t={t} titulo="Tiempo de permanencia"><BarrasH t={t} datos={ind.tiempo} color="#C2841E" /></Panel>
          <Panel t={t} titulo="Profesional que acompaña"><BarrasH t={t} datos={ind.prof} color="#E8634C" /></Panel>
          <Panel t={t} titulo="Estudiantes con mayor cantidad de visitas"><BarrasH t={t} datos={ind.topEst} color="#2C7A6B" /></Panel>
        </div>
      )}
      {toast && <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:t.ink, color:'#fff', padding:'11px 20px', borderRadius:12, fontSize:12.5, fontWeight:700, zIndex:500, boxShadow:'0 8px 30px rgba(0,0,0,0.3)' }}>{toast}</div>}
    </div>
  );
}

// ── Informe imprimible de la Sala ──
function imprimirSala(data){
  const esc=(s)=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const logo = location.origin+location.pathname.replace(/[^/]*$/,'')+'logo-blanco.png';
  const cnt=(key)=>{ const o={}; data.forEach(r=>{ const k=r[key]||'—'; o[k]=(o[k]||0)+1; }); return Object.entries(o).sort((a,b)=>b[1]-a[1]); };
  const totMin=data.reduce((a,r)=>a+(r.minutos||0),0); const prom=data.length?Math.round(totMin/data.length):0;
  const tabla=(titulo,rows)=> rows.length?`<h2>${titulo}</h2><table><tbody>${rows.map(([l,v])=>`<tr><td>${esc(l)}</td><td style="text-align:right;font-weight:700;width:70px">${v}</td></tr>`).join('')}</tbody></table>`:'';
  const matO={}; data.forEach(r=>(r.mats||[]).forEach(m=>{ matO[m]=(matO[m]||0)+1; })); const mats=Object.entries(matO).sort((a,b)=>b[1]-a[1]);
  const estO={}; data.forEach(r=>{ estO[r.estNombre]=(estO[r.estNombre]||0)+1; }); const topEst=Object.entries(estO).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const bit=data.map(r=>`<tr><td>${esc(r.fecha)}</td><td>${esc(r.estNombre)}</td><td>${esc(r.curso)}</td><td>${esc(r.hi)}–${esc(r.hf)}</td><td style="text-align:center">${r.minutos}</td><td>${esc(r.motivo)}</td><td>${esc(r.ef)}</td></tr>`).join('');
  const html=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Sala de Neurobienestar</title>
  <style>@page{size:A4;margin:16mm 14mm}*{box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;color:#1a2b25;margin:0}
  .head{display:flex;align-items:center;gap:14px;background:#2C7A6B;color:#fff;padding:14px 18px;border-radius:10px}.head img{height:42px}.head h1{font-size:16px;margin:0;font-weight:800}.head p{margin:2px 0 0;font-size:11px;opacity:.9}
  .kpis{display:flex;gap:12px;margin:14px 0}.kpi{flex:1;background:#F0F6F4;border:1px solid #cfe3dd;border-radius:9px;padding:11px 14px}.kpi b{display:block;font-size:22px;color:#2C7A6B}.kpi span{font-size:10.5px;color:#5a6b64}
  h2{font-size:12px;color:#2C7A6B;margin:18px 0 7px;text-transform:uppercase;letter-spacing:.5px}
  table{width:100%;border-collapse:collapse;font-size:11px}th{background:#EAF2EF;color:#2C7A6B;text-align:left;padding:7px 9px;font-size:9.5px;text-transform:uppercase}td{padding:6px 9px;border-bottom:1px solid #e6ebe9}
  .ft{margin-top:18px;text-align:center;font-size:8.5px;color:#999;border-top:1px solid #ddd;padding-top:7px}@media print{.noprint{display:none}}</style></head><body>
  <div class="head"><img src="${logo}" onerror="this.style.display='none'"><div><h1>Informe · Sala de Neurobienestar</h1><p>Colegio Mayor Peñalolén · Equipo Psicoeducativo</p></div></div>
  <div class="kpis"><div class="kpi"><b>${data.length}</b><span>Visitas registradas</span></div><div class="kpi"><b>${prom} min</b><span>Tiempo promedio</span></div><div class="kpi"><b>${[...new Set(data.map(r=>r.estNombre))].length}</b><span>Estudiantes distintos</span></div></div>
  ${tabla('Uso por ciclo escolar', cnt('ciclo'))}
  ${tabla('Motivos de ingreso', cnt('motivo'))}
  ${tabla('Materiales más utilizados', mats)}
  ${tabla('Profesional que acompaña', cnt('profesional'))}
  ${tabla('Estudiantes con mayor cantidad de visitas', topEst)}
  <h2>Bitácora completa</h2><table><thead><tr><th>Fecha</th><th>Estudiante</th><th>Curso</th><th>Horario</th><th style="text-align:center">Min</th><th>Motivo</th><th>Estado final</th></tr></thead><tbody>${bit||'<tr><td colspan="7" style="text-align:center;color:#999">Sin registros</td></tr>'}</tbody></table>
  <div class="ft">Generado el ${new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'long',year:'numeric'})} · Documento confidencial de uso interno</div>
  <div class="noprint" style="text-align:center;margin-top:16px"><button onclick="window.print()" style="background:#2C7A6B;color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer">Imprimir / Guardar PDF</button></div>
  </body></html>`;
  const w=window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); }
}

Object.assign(window, { SalaNeurobienestar, useSala, salaResumenGestion: ()=>{ const d=_lg('psico_sala_v1',[]); const totMin=d.reduce((a,r)=>a+(r.minutos||0),0); const porCiclo={}; d.forEach(r=>{ porCiclo[r.ciclo||'—']=(porCiclo[r.ciclo||'—']||0)+1; }); const top=Object.entries(porCiclo).sort((a,b)=>b[1]-a[1])[0]; return { total:d.length, prom:d.length?Math.round(totMin/d.length):0, cicloTop: top?top[0]:'—', estudiantes:[...new Set(d.map(r=>r.estNombre))].length }; } });
