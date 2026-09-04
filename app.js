const KEY="store_products_v1", CART="store_cart_v1";
const demo=[
{id:1,name:"مثقاب كهربائي احترافي",price:499,oldPrice:599,category:"أدوات كهربائية",image:"",description:"مثقاب قوي للاستخدام المنزلي والمهني."},
{id:2,name:"صندوق أدوات متعدد",price:249,oldPrice:299,category:"أدوات يدوية",image:"",description:"مجموعة أدوات عملية للاستخدام اليومي."},
{id:3,name:"سلم ألمنيوم 5 درجات",price:379,oldPrice:429,category:"معدات",image:"",description:"سلم خفيف ومتين."},
{id:4,name:"مصباح LED عملي",price:89,oldPrice:109,category:"كهرباء",image:"",description:"إضاءة LED موفرة للطاقة."},
{id:5,name:"شريط قياس 5 متر",price:39,oldPrice:49,category:"أدوات يدوية",image:"",description:"شريط قياس متين وسهل الاستخدام."},
{id:6,name:"مفك كهربائي",price:159,oldPrice:189,category:"أدوات كهربائية",image:"",description:"مفك لاسلكي للأعمال المنزلية."},
{id:7,name:"حقيبة تخزين",price:119,oldPrice:149,category:"تخزين",image:"",description:"حقيبة عملية لترتيب الأدوات."},
{id:8,name:"قفازات حماية",price:29,oldPrice:39,category:"معدات",image:"",description:"قفازات للحماية أثناء العمل."}
];
function products(){
  try{
    let p=localStorage.getItem(KEY);
    if(!p){localStorage.setItem(KEY,JSON.stringify(demo));return demo}
    const parsed=JSON.parse(p);
    return Array.isArray(parsed)?parsed:demo;
  }catch(e){return demo}
}
function save(p){
  try{localStorage.setItem(KEY,JSON.stringify(p));return true}
  catch(e){alert("تعذر حفظ البيانات في المتصفح");return false}
}
function cart(){return JSON.parse(localStorage.getItem(CART)||"[]")}
function saveCart(c){localStorage.setItem(CART,JSON.stringify(c));updateCount()}
function updateCount(){let n=cart().reduce((s,x)=>s+x.qty,0);document.querySelectorAll("#cartCount").forEach(e=>e.textContent=n)}
function add(id){let c=cart(),x=c.find(i=>i.id===id);x?x.qty++:c.push({id,qty:1});saveCart(c);alert("تمت إضافة المنتج إلى السلة")}
function filterProducts(cat=""){let q=(document.getElementById("search")?.value||"").toLowerCase();let list=products().filter(p=>(!cat||p.category===cat)&&(!q||p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)));render(list);if(document.getElementById("resultText"))document.getElementById("resultText").textContent=`${list.length} منتج`}
function render(list=products()){let el=document.getElementById("products");if(!el)return;el.innerHTML=list.map(p=>`<article class="card"><div class="pic">${p.image?`<img src="${escapeHtml(p.image)}" alt="">`:`<div class="placeholder">🛠️</div>`}</div><div class="info"><span class="cat">${escapeHtml(p.category)}</span><h3>${escapeHtml(p.name)}</h3><div class="price">${p.price} درهم ${p.oldPrice?`<span class="old">${p.oldPrice}</span>`:""}</div><button class="add" onclick="add(${p.id})">أضف إلى السلة</button></div></article>`).join("")}
function escapeHtml(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function initCats(){let el=document.getElementById("categories");if(!el)return;let cats=["الكل",...new Set(products().map(p=>p.category))];el.innerHTML=cats.map((c,i)=>`<button class="${i===0?"active":""}" onclick="filterProducts(${i===0?"''":JSON.stringify(c)})">${escapeHtml(c)}</button>`).join("")}
function renderCart(){let el=document.getElementById("cart");if(!el)return;let c=cart(),ps=products();if(!c.length){el.innerHTML='<div class="empty"><h2>السلة فارغة 🛒</h2><a class="btn" href="index.html">ابدأ التسوق</a></div>';return}let total=0;el.innerHTML=c.map(i=>{let p=ps.find(x=>x.id===i.id);if(!p)return"";total+=p.price*i.qty;return `<div class="cartItem"><div class="pic"><div class="placeholder">🛠️</div></div><div style="flex:1"><strong>${escapeHtml(p.name)}</strong><div>${p.price} درهم</div></div><div class="qty"><button onclick="changeQty(${i.id},-1)">−</button> ${i.qty} <button onclick="changeQty(${i.id},1)">+</button></div><strong>${p.price*i.qty} درهم</strong></div>`}).join("")+`<div class="total">المجموع: ${total} درهم<br><button class="btn" onclick="alert('هذه نسخة تجريبية. اربط الدفع/واتساب لاحقًا.')">إتمام الطلب</button></div>`}
function changeQty(id,d){let c=cart(),x=c.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)c=c.filter(i=>i.id!==id);saveCart(c);renderCart()}
function adminInit(){let f=document.getElementById("productForm");if(!f)return;renderAdmin();f.onsubmit=e=>{e.preventDefault();let p=products();p.push({id:Date.now(),name:name.value,price:+price.value,oldPrice:+oldPrice.value||0,category:category.value,image:image.value,description:description.value});save(p);f.reset();renderAdmin();alert("تمت إضافة المنتج")}}
function renderAdmin(){let el=document.getElementById("adminProducts");if(!el)return;el.innerHTML=products().map(p=>`<div class="adminRow"><span><strong>${escapeHtml(p.name)}</strong> — ${p.price} درهم</span><button onclick="removeProduct(${p.id})">حذف</button></div>`).join("")}
function removeProduct(id){save(products().filter(p=>p.id!==id));renderAdmin()}
function resetProducts(){if(confirm("استعادة المنتجات التجريبية؟")){save(demo);renderAdmin()}}
document.addEventListener("DOMContentLoaded",()=>{updateCount();initCats();render();renderCart();adminInit();document.getElementById("search")?.addEventListener("input",()=>filterProducts())});