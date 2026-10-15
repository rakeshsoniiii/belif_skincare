import * as THREE from 'three';
const canvas=document.querySelector('#botanical-scene');
// Decorative WebGL accents only; the product photograph and shopping UI work without WebGL.
if(canvas){try{
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.z=6;
 const group=new THREE.Group();scene.add(group);scene.add(new THREE.AmbientLight(0xffffff,2));const light=new THREE.DirectionalLight(0xfff2c9,3);light.position.set(2,4,5);scene.add(light);
 const geometry=new THREE.TorusGeometry(.13,.018,8,32),material=new THREE.MeshStandardMaterial({color:0xc3a664,metalness:.7,roughness:.25});
 for(let i=0;i<9;i++){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(Math.sin(i*2.4)*2.1,Math.cos(i*1.7)*2.3,-.5);mesh.rotation.set(i*.4,i*.7,0);group.add(mesh)}
 let paused=matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('paused'),visible=true,frame;
 const render=()=>renderer.render(scene,camera);
 function tick(t){if(paused||!visible||document.hidden){frame=undefined;return}group.rotation.z=Math.sin(t*.00012)*.06;group.children.forEach((m,i)=>m.rotation.y=t*.00025+i);render();frame=requestAnimationFrame(tick)}
 function restart(){if(frame)cancelAnimationFrame(frame);frame=undefined;render();if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick)}
 new ResizeObserver(()=>{const r=canvas.parentElement.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();render()}).observe(canvas.parentElement);
 new IntersectionObserver(([e])=>{visible=e.isIntersecting;restart()}).observe(canvas);
 document.addEventListener('belif-motion',e=>{paused=e.detail.paused;restart()});document.addEventListener('visibilitychange',restart);
 canvas.parentElement.addEventListener('pointermove',e=>{if(paused||e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();group.rotation.y=(e.clientX-r.left-r.width/2)/r.width*.25});
 restart();
}catch{canvas.hidden=true}}
