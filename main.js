import { Application, Router, helpers } from "https://deno.land/x/oak/mod.ts";
const app = new Application();
const router = new Router();
let players = [];

router.get("/list", (ctx) => {
  const target = ctx.sendEvents();
  target.dispatchMessage({ d: players });
  target.close();
});

router.get("/a", (ctx) => {
  let data = helpers.getQuery(ctx);
  console.log("receive", data);
  let n = data.n;
  let s = data.s;
  //TODO 「可删减」 取name集合
  let name_list = players.map((item) => item.n);
  let index = name_list.indexOf(n);
  console.log(name_list);
  console.log("Index of", index);
  if (index == -1) {
    players.push(data);
  } else if (players[index].s < s) {
    console.log("update");
    players[index].s = s;
  }
  players.sort((a, b) => {
    return b["s"] - a["s"];
  });
  console.log(players);
});

router.get("/string", (ctx) => {
  const target = ctx.sendEvents();
  target.dispatchMessage(JSON.stringify(players));
  target.close();
});

router.get("/", (ctx) => {
  ctx.response.body ="<!DOCTYPE html> <html> <body> <div id='app'> <dialog class='nes-dialog is-rounded' id='dialog-rounded'> <form method='dialog'> <p class='title'>About</p> <p>游戏规则：抓住鬼畜的数字或运算符，组成数学表达式，使其运算结果等于1024即可胜利</p> <p>分数计算规则：你猜</p> <p>项目说明：本来想把这个项目大小控制在1024byte的，后来能力有限实在搞不定，就放飞了</p> <p>没有做移动端适配，尽量还是用主流桌面端浏览器体验吧</p> <p>由于没有找到合适的像素中文字体，为了整体的美观，项目中都用的英文</p> <p>没有做数据库，分数排名直接保存在内存里，如果想永久保存自己的高分，就自己截图吧</p> <p>没有做加密，强行提交高分很容易，但是请最好不要那么做</p> <p>遇到bug不要急，直接提issues或者fork出去修，我近期应该也没有时间去修复了「备战考研，互联网再见」</p> <div style='text-align: center;'> <section> <button class='nes-btn is-primary'>Get It</button> </section> <section style='margin-top:1rem;'> <a class='nes-icon github is-medium' href='https://github.com/levi-oh/1024'></a> </section> </div> </form> </dialog> <div v-if='not_begin' class='nes-container with-title is-centered' style='margin: 5vh; padding: 5vh' > <span class='title nes-text' style='font-size: 2rem'>1024 byte</span> <input v-model='n' placeholder='Input Your Name (or Jike ID) Here' v-if='not_begin' class='nes-input is-warning' style='margin: 5vh 0 5vh 0' maxlength='24' /> <section> <button @click='begin' v-if='not_begin' class='nes-btn is-warning'> Start </button> </section> <section style='margin-top: 5vh'> <button type='button' class='nes-btn' @click='showAbout()'> About </button> </section> </div> <div v-if='not_begin' class='nes-container with-title is-centered' style='margin: 5vh; padding: 5vh' > <p class='title'><i class='nes-icon trophy is-large'></i></p> <ol> <li v-for='(i, d) in p'>{{ i.n+' : '+i.s }}</li> </ol> </div> <div v-if='!not_begin'> <dialog class='nes-dialog' id='dialog-win'> <form method='dialog'> <p class='title'>You Win!</p> <p>Score: {{final_s}}</p> <menu class='dialog-menu'> <button class='nes-btn is-primary' @click='showRank'>Show Rank List</button> </menu> </form> </dialog> <div class='nes-container is-rounded is-dark' style='text-align: center' > <p>{{the_evaled_answer}}</p> </div> <i class='nes-icon is-large' v-bind:class='{coin:!if_win,trophy:if_win}' style='position: fixed; top: 50vh; left: 49vw; z-index: 99' @click='transform()' ></i> <span class='nes-text trans' v-for='(i, d) in num_list' v-bind:style=\"{ top: i.t+ 'vh',left: i.l+'vw',color:i.co }\" @click='catch_char(d)' > {{ i.c }} </span> <div class='nes-field is-inline' style='position: absolute; bottom: 1vh; width: 100vw' > <input type='text' id='warning_field' disabled='disabled' class='nes-input is-warning' style='background: #fff; width: auto; margin-left: 1vw' v-model='show_str' /> <label ><button type='button' class='nes-btn is-error' style='margin-left: 1rem; width: 20vw' @click='delete_one' > {{if_win?'Show Score':'<'}} </button></label > </div> </div> </div> </body> <script src='https://unpkg.com/vue@3.1.4'></script> <script src='https://unpkg.com/axios@0.21.1/dist/axios.min.js'></script> <link href='https://unpkg.com/nes.css@2.3.0/css/nes.min.css' rel='stylesheet' /> <link href='https://fonts.googleapis.com/css?family=Press+Start+2P' rel='stylesheet' /> <script> Vue.createApp({ data() { return { n: '', s: 0, final_s: 0, not_begin: 1, p: "+
  JSON.stringify(players)+", num_list: [{ l: 50, t: 50, c: '1', co: '#000' }], sp_position: 0, last_sp_position: 0, char_chatch: 999, loop: 0, catch_str: '', show_str: '', the_evaled_answer: 0, gen_speed: 1000, if_win: false, if_add:false, }; }, methods: { add() { if(!this.if_add){ axios .get(`/a?n=${this.n}&s=${this.final_s}`) .then() .catch(() => { }); this.if_add = true; } }, transform() { this.s--; for (num in this.num_list) { if (num == this.char_chatch) { if (this.loop < 2) { this.loop++; } else { this.loop = 0; this.char_chatch = 999; this.num_list[num].c = ''; } } else { this.num_list[num].t = 10 + Math.floor(Math.random() * 80); this.num_list[num].l = 10 + Math.floor(Math.random() * 80); } } if (this.num_list.length < 80) { var t = '135679+-'; var color = '#' + ((Math.random() * 0xffffff) << 0).toString(16); this.num_list.push({ l: 50, t: 50, c: t.charAt(Math.floor(Math.random() * t.length)), co: color, }); } else { var t = '135679++++-***'; this.num_list[this.sp_position].l = 50; this.num_list[this.sp_position].t = 50; if (this.if_win) { this.num_list[this.last_sp_position].c = 'Win!'; } else { this.num_list[this.last_sp_position].c = t.charAt( Math.floor(Math.random() * t.length) ); } this.last_sp_position = this.sp_position; if (this.sp_position < this.num_list.length - 1) { this.sp_position += 1; } else { this.sp_position = 0; } } }, begin() { let _this = this; if (this.n == '') { alert('Input your name to start'); } else { this.not_begin = 0; this.s = 1024; console.log('start'); setInterval(function () { _this.transform(); }, this.gen_speed); } }, catch_char(d) { this.char_chatch = d; console.log('catch', this.num_list[d]); this.num_list[d].l = 10; this.num_list[d].t = 93; this.catch_str += this.num_list[d].c; try { this.the_evaled_answer = eval(this.catch_str); this.show_str = this.catch_str + '=' + this.the_evaled_answer; } catch (error) { this.the_evaled_answer = 'error'; this.show_str = this.catch_str + '=error'; } if (this.the_evaled_answer == 1024) { this.if_win = true; this.final_s = this.s; this.show_str = 'Congratulations!'; this.add() } }, delete_one() { this.catch_str = this.catch_str.substring( 0, this.catch_str.length - 1 ); try { this.the_evaled_answer = eval(this.catch_str); this.show_str = this.catch_str + '=' + this.the_evaled_answer; } catch (error) { this.the_evaled_answer = 'error'; this.show_str = this.catch_str + '=error'; } if(this.if_win){ this.showScore() } }, showRank(){ location.reload(); }, showScore(){ document.getElementById('dialog-win').showModal(); }, showAbout(){ document.getElementById('dialog-rounded').showModal(); } }, }).mount('#app'); </script> <style> html, body, pre, code, kbd, samp { font-family: 'Press Start 2P', 'GB18030 Bitmap'; font-weight: bolder; } .trans { padding: 10px; font-size: 2rem; position: absolute; transition: 1s; -webkit-transition: 1s; } </style> </html>"
  ctx.response.type = "text/html";
});

app.use(router.routes());
await app.listen(":80");
//addEventListener("fetch", app.fetchEventHandler());
