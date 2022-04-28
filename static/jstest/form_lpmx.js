/* jshint esversion: 8 */


const h_menu_form_lpmx = `
<div id="lpmx_menu_id" class="menu_bar" >
<ul>
  <li class="v">
    <a class="tipb" href="#" cmd="show_text">Text
      <span class="tiptextb">Displays Lines of Text</span>
    </a>
  </li>
  <li class="v">
    <a class="tipb" cmd="save_data" href="#">Save
      <span class="tiptextb">Save the Data on the Server</span>
    </a>
  </li>
  <li class="v">
    <a class="tipb" cmd="load_data" href="#">Load
      <span class="tiptextb">Read Data from Server</span>
    </a>
  </li>
  <li class="v">
    <a href="#">Corpus</a>
    <ul class="v">
      <li class="h">
        <a class="tipr" cmd="check_text" href="#">Check Text
          <span class="tiptextr">Check Homographs and Forms without Tokenss</span>
        </a>
      </li>
      <li class="h">
        <a class="cmd tipr" cmd="upd_text" href="#">Update Text
          <span class="tiptextr">Update Text with the Corpus</span>
        </a>
      </li>
      <li class="h">
        <a class="cmd tipr" cmd="upd_corpus" href="#">Update Corpus
          <span class="tiptextr">Update Corpus with the Text</span>
        </a>
      </li>
      <li class="h">
        <a class="cmd tipr" cmd="diff_text_corpus" href="#">Compare Corpus
          <span class="tiptextr">Compare the Text on the server with the Corpus</span>
        </a>
      </li>
      
    </ul>
  </li>
  <li class="v">
    <a class="tipb title" cmd="select_text" href="#">Select Text
      <span class="tiptextb">Load selected Text</span>
    </a>
  </li>
  <li class="v">
    <a href="#">Utils</a>
    <ul class="v">
      <li class="h">
        <a class="tipr" cmd="resetxy" href="#">Relocate
          <span class="tiptextr">Relocate all Windows</span>
        </a>
      </li>
      <li class="h">
        <a class="cmd tipr" cmd="show_store" href="#">Show Store
        </a>
      </li>
      <li class="h">
        <a class="cmd tipr" cmd="clear_store" href="#">Clean Store
          <span class="tiptextr">Clean LocalStore</span>
        </a>
      </li>
    </ul>
  </li>
  <li class="v">
    <a class="cmd" cmd="help" href="#">Help
    </a>
  </li>
  <li class="v">
    <a class="tipb" cmd="cmd_log" href="#">Log
      <span class="tiptextb">Toggle Log</span>
    </a>
  </li>
  <li class="v">
    <a cmd="close" href="#">close
    </a>
  </li>
</ul>
</div>


<div id='lpmx_rows_head_id'>
<table>
<tr>
  <td class="n" ><span class="tipb">C
    <span class="tiptextb">Open Context of Form</span>
  </span></td>
  <td class="fr">form</td>
  <td class="find">
    <a class="cmd tipb" cmd="scroll" href="#">find
      <span class="tiptextb">Goes to the position<br/> of the selected word</span>
    </a>
    <input type="text" value="" size="2" >
  </td>
  <td class="l">lemma</td>
  <td class="e">etimo</td>
  <td class="ph">lang</td>
  <td class="p">POS</td>
  <td class="fn">funct</td>
  <td class="m">MSD</td>
</tr> 
</table>
</div>
`;
//forma, lemma, etimo, lang, POS, funct, MSD

var FormLpmx = {
  id: "lpmx_id",
  tr_selected: null,
  //scroll_top: 0,
  exe: function (cmd) {
    switch (cmd) {
      case "show_text":
        this.save_store(); //FIXME
        Ula.show_text();
        break;
      case "select_text":
        this.select_text();
        break;
      case "save_data":
        if (confirm("Save Data ?"))
          this.save_data();
        break;
      case "load_data":
        if (confirm("Load Data ?"))
          this.load_data();
        break;

      case "check_text":
        this.check_text();
        break;

      case "upd_corpus":
        if (!confirm("Save Data ?"))
          return;
        new Promise((resolve, reject) => {
          this.save_data();
          resolve();
          reject();
        }).then(() => {
          if (confirm("Update corpus ?"))
            this.update_corpus();
        });
        break;

      case "upd_text":
        if (!confirm("Save Data ?"))
          return;
        new Promise((resolve, reject) => {
          this.save_data();
          resolve();
          reject();
        }).then(() => {
          if (confirm("Update text ?"))
            this.update_text();
        });
        break;

      case "diff_text_corpus":
        this.diff_text_corpus();
        break;

      case "help":
        Help.toggle("help1.html");
        break;
      case "cmd_log":
        cmd_log_toggle();
        break;
      case "resetxy":
        relocate();
        break;
      case "show_store":
        cmd_show_store();
        break;
      case "clear_store":
        if (confirm("Clear Local Store ?"))
          DbFormLpmx.clear_store();
        break;
      case "close":
        cmd_close();
        break;
      case "scroll":
        FormLpmx.scroll();
        break;
      default:
        alert("command not found.");
    }
  },
  open: async function () {
    let jt = UaJt();
    jt.append(h_menu_form_lpmx + "<div id='lpmx_rows_id'></div>");
    const html = jt.html();
    $("#" + this.id).html(html);
    //console.log(jt.text());
    this.bind_menu();
    this.form_lst2html();
    const e = document.querySelector("#lpmx_menu_id ul li a.title");
    e.innerHTML = DbFormLpmx.text_name;
  },
  select_text: async function () {
    let input_call = async function (text_name) {
      const tname = text_name || null;
      if (!tname) return;
      if (!confirm(`Load ${tname} ?`))
        return;
      cmd_notify_at(400, 200, tname, "Load");
      DbFormLpmx.set_text_name(tname);
      let ok = await DbFormLpmx.load_data();
      if (!ok) {
        alert(tname + " Not Found.");
        return;
      }
      const menu = document.querySelector("#lpmx_menu_id");
      const e = menu.querySelector("ul li a.title");
      e.innerHTML = tname;
      relocate();
      form_resetxy();
      // prepara per la schermta FormText 
      DbFormLpmx.fill_rows_text();
      FormText.rows_text2html();
      cmd_notify_hide();
    };
    let text_lst = await DbFormLpmx.load_text_list();
    UlaOption.open("lpmx_id", "select_text_id", text_lst, input_call).at(400, 100).show();
  },
  load_data: async function () {
    //UaLog.log("FFF load_data");
    DbFormLpmx.clear_store();
    const ok = await DbFormLpmx.load_data();
    if (!ok)
      return false;
    this.form_lst2html();
    return true;
  },
  form_lst2html: function () {
    //UaLog.log("FFF form_lst2html");
    //form,formkey,lemma,etimo, phon, pos, msd ..
    const lfe = DbFormLpmx.form_lst.length;
    if (lfe == 0) {
      return;
    }
    let jt = UaJt();
    jt.append("<table>");
    const tr_tmpl = `
    <tr n="{i}">
      <td class="n" name="n">{i}</td>
      <td class="fr" name="fr" >{fr}</td>
      <td class="{disp}" name="fk">{fk}</td>
      <td class="l" name="l"><input type="text" value="{l}" size="4" ></td>
      <td class="e" name="e"><input type="text" value="{e}" size="4" ></td>
      <td class="ph">{ph}</td>
      <td class="p">{p}</td>
      <td class="fn">{fn}</td>
      <td class="m">{m}</td>
    </tr> 
   `;
    for (let i = 0; i < lfe; i++) {
      const r = DbFormLpmx.form_lst[i];
      const disp = r[0] == r[1] ? "f" : "k";
      const d = {
        i: i,
        fr: r[0],
        disp: disp,
        fk: r[1],
        l: r[2],
        e: r[3],
        ph: r[4],
        p: r[5],
        fn: r[6],
        m: r[7]
      };
      jt.append(tr_tmpl, d);
    }
    jt.append("</table>");
    const html = jt.html();
    $("#lpmx_rows_id").html(html);
    //setta la classe bl per le form che hanno omografi nel corpus
    const fr_lst = document.querySelectorAll("#lpmx_rows_id tr td.fr");
    const omogr_js = DbFormLpmx.omogr_json;
    const omogr_ks = Object.keys(omogr_js);
    const omogr_lst = Array.from(fr_lst).filter(e => omogr_ks.includes(e.innerHTML));
    for (let td of omogr_lst) {
      let tr = td.parentElement;
      tr.classList.add("bl");
    }

    //sett la clase emp per le form che non hanno tokens 
    const fk_lst = document.querySelectorAll("#lpmx_rows_id tr td[name='fk']");
    let tks = DbFormLpmx.token_lst.map(e => e[1]);
    let fks = DbFormLpmx.form_lst.map(e => e[1]);
    let fkes = fks.filter((e) => !tks.includes(e));
    //console.log(fkes);
    const empty_lst = Array.from(fk_lst).filter(e => fkes.includes(e.innerHTML));
    //console.log(empty_lst);
    for (let td of empty_lst) {
      let tr = td.parentElement;
      tr.classList.add("empty");
    }
    this.bind_rows();
  },
  check_text: function () {
    const omogr_js = DbFormLpmx.omogr_json;
    const omogr_ks = Object.keys(omogr_js);
    //seleziona le form del testo che sono omografe in corpus
    const form_omogr_lst = DbFormLpmx.form_lst.filter(e => omogr_ks.includes(e[1]));
    const fkos = form_omogr_lst.map(e => e[1]);
    let jt = UaJt();
    const h_omgr = `<div>Homographs Tokens`;
    jt.append(h_omgr);
    for (const k of fkos.sort()) {
      const rows = omogr_js[k];
      let ls = [];
      for (const row of rows)
        ls.push(row[1]);
      const s = ls.join("&nbsp;&nbsp;&nbsp;");
      const h = `<div>${s}</div>`;
      jt.append(h);
    }
    jt.append("</div><hr/>");
    const h_emp = `<div>Forms without any Tokens`;
    jt.append(h_emp);

    //sett la clase emp per le form che non hanno tokens 
    let tks = DbFormLpmx.token_lst.map(e => e[1]);
    let fks = DbFormLpmx.form_lst.map(e => e[1]);
    let fkes = fks.filter((e) => !tks.includes(e));
    for (const k of fkes)
      jt.append(`<div>${k}</div>`);
    jt.append("<hr/></div>");
    const h = jt.html();
    UlaInfo.open(h, 1050, 50);

  },
  diff_text_corpus: function () {

    const call = function (js) {
      js = js || {};
      let rows = js.data || null;
      if (!rows || rows.length == 0) {
        rows = [];
      }
      let jt = UaJt();
      const h_omgr = `<div>Text DIFF Corpus`;
      jt.append(h_omgr);
      for (const row of rows) {
        let fc = row.split("$");
        if (fc.length < 2) continue;
        let f = fc[0];
        let c = fc[1];
        f = f.replace(/\|/g, ', ');
        c = c.replace(/\|/g, ', ');
        const h = `
        <div>
        <div>${f}</div>
        <div>${c}</div>
        </div>
        <br/>
        `;
        jt.append(h);
      }
      if (rows.length == 0) {
        const h = `<br/><br/>
        <div><b>
        There is no Difference
        </b></div>`;
        jt.append(h);
      }
      jt.append("<br/><br/></div>");
      const h = jt.html();
      UlaInfo.open(h, 100, 50);
    };

    DbFormLpmx.load_diff_text_corpus(call);

  },
  bind_menu: function () {
    const menu = document.getElementById("lpmx_menu_id");
    const call = (ev) => {
      const t = ev.target;
      if (t.tagName == 'A') {
        const cmd = t.getAttribute("cmd");
        if (!!cmd) {
          this.exe(cmd);
        }
      }
    };
    menu.addEventListener("click", call);

    const head = document.getElementById("lpmx_rows_head_id");
    head.addEventListener("keyup", (ev) => {
      const t = ev.target;
      if (t.tagName == "INPUT") {
        const key = ev.which || ev.keyCode || 0;
        if (ev.ctrlKey) {
          if (key == 88) {
            ev.target.value = "";
            ev.preventDefault();
          }
          ev.stopImmediatePropagation();
          return;
        }
        if (key == "13") {
          this.scroll();
          ev.preventDefault();
        }
      }
    });
  },
  bind_rows: function () {
    const table = document.querySelector("#lpmx_rows_id table");
    table.addEventListener("click", (ev) => {
      const t = ev.target;
      if (t.tagName == 'TD') {
        table.querySelectorAll("tr.select").forEach(e => e.classList.remove("select"));
        const tr = t.closest('TR');
        this.tr_selected = tr;
        tr.classList.add("select");
        tr.querySelector("input").focus();
        if (t.getAttribute("name") == "n") {
          const forma = tr.querySelector("td[name=fr]").innerHTML;
          const formakey = tr.querySelector("td[name=fk]").innerHTML;
          const forma_idx = t.innerHTML;
          this.open_context(forma_idx, forma, formakey);
        }
      }
    });
    table.addEventListener("mouseover", (ev) => {
      const t = ev.target;
      if (t.tagName == 'TD') {
        table.querySelectorAll("tr.hover").forEach(e => e.classList.remove("hover"));
        const tr = t.closest('TR');
        tr.classList.add("hover");
      }
    });
    table.addEventListener("keydown", (ev) => {
      const t = ev.target;
      if (t.tagName == 'INPUT') {
        const key = ev.which || ev.keyCode || 0;
        if (ev.ctrlKey) {
          if (key == 88) {
            t.value = "";
            ev.preventDefault();
          }
          ev.stopImmediatePropagation();
          return;
        }
        if ([38, 40].includes(key)) {
          t.blur();
          const td = t.closest("TD");
          const name = td.getAttribute("name");
          const tr = t.closest("TR");
          let trx = key == 38 ? tr.previousElementSibling : tr.nextElementSibling;
          if (!trx) return;
          trx.querySelector("td[name=" + name + "] input").focus();
        }
      }
    });
    table.addEventListener("focusin", (ev) => {
      const t = ev.target;
      if (t.tagName == 'INPUT') {
        const tr = t.closest("TR");
        table.querySelectorAll("tr.hover").forEach(e => e.classList.remove("hover"));
        table.querySelectorAll("tr.select").forEach(e => e.classList.remove("select"));
        tr.classList.add("select");
        this.tr_selected = tr;
      }
    });
    table.addEventListener("change", (ev) => {
      const t = ev.target;
      if (t.tagName == 'INPUT') {
        FormLpmx.save_store();
      }
    });
  },
  set_pos_msd: function (pos, msd) {
    if (!this.tr_selected) {
      cmd_notify("Form Not Selected.");
      return;
    }
    pos = pos == '-' ? '' : pos;
    msd = pos == '-' ? '' : msd;
    const p = $("#lpmx_rows_id tr.select").find("td.p");
    p.html(pos);
    let e = p.get(0);
    const m = $("#lpmx_rows_id tr.select").find("td.m");
    m.html(msd);
    this.save_store();
    const pr = document.getElementById("lpmx_rows_id");
    cmd_notify_link(pr, e, 0, 20, "Set POS - MSD");
  },
  set_phon: function (phon) {
    if (!this.tr_selected) {
      cmd_notify("row not selected.");
      return;
    }
    phon = phon == '-' ? '' : phon;
    const ph = $("#lpmx_rows_id tr.select").find("td.ph");
    ph.html(phon);
    let e = ph.get(0);
    this.save_store();
    const pr = document.getElementById("lpmx_rows_id");
    cmd_notify_link(pr, e, -40, 20, "Set lang");
  },
  set_funct: function (funct) {
    if (!this.tr_selected) {
      cmd_notify("row not selected.");
      return;
    }
    funct = funct == '-' ? '' : funct;
    const fn = $("#lpmx_rows_id tr.select").find("td.fn");
    fn.html(funct);
    let e = fn.get(0);
    this.save_store();
    const pr = document.getElementById("lpmx_rows_id");
    cmd_notify_link(pr, e, -40, 20, "Set funct");
  },
  save_store: function () {
    //UaLog.log("FFF save_store");
    this.html2form_lst();
    DbFormLpmx.set_store();
  },
  save_data: function () {
    //UaLog.log("FFF save_data");
    this.html2form_lst();
    DbFormLpmx.save_data();
  },
  update_corpus: function () {
    //UaLog.log("FFF update_corpus");

    const call = function (js) {
      const rows = js.data || null;
      if (!rows) return;
      if (rows.length == 0) return;
      let jt = UaJt();
      const h_omgr = `<div>Coorpus Data Overwriten `;
      jt.append(h_omgr);
      for (const row of rows) {
        let fc = row.split("$");
        if (fc.length < 2) continue;
        let f = fc[0];
        let c = fc[1];
        f = f.replace(/\|/g, ', ');
        c = c.replace(/\|/g, ', ');
        const h = `
        <div>
        <div>${f}</div>
        <div>${c}</div>
        </div>
        <br/>
        `;
        jt.append(h);
      }
      jt.append("<br/><br/></div>");
      const h = jt.html();
      UlaInfo.open(h, 100, 50);
    };
    DbFormLpmx.update_corpus(call);
  },
  update_text: function () {
    //UaLog.log("FFF update_twxt");
    // dati textt aggironati da
    // this.html2form_lst();
    // chaimato da save_data
    DbFormLpmx.update_text();
  },
  html2form_lst: function () {
    //UaLog.log("FFF html2form_lst");
    //TODO perfezionare html <-> list
    //console.time("html2form_lst");
    let trs = $("#lpmx_rows_id table").find("tr");
    DbFormLpmx.form_lst = [];
    //n,form,formkey,lemma,etimo,phon,pos,msd
    $(trs).each(function () {
      let tds = $(this).find("td");
      let form = tds[1].innerHTML;
      let formkey = tds[2].innerHTML;
      let lemma = $(tds[3]).find("input").val();
      let etimo = $(tds[4]).find("input").val();
      let phon = tds[5].innerHTML;
      let pos = tds[6].innerHTML;
      let funct = tds[7].innerHTML;
      let msd = tds[8].innerHTML;
      //forma, lemma, etimo, lang, POS, funct, MSD
      DbFormLpmx.form_lst.push([form, formkey, lemma, etimo, phon, pos, funct, msd]);
    });
  },
  open_context: function (form_idx, form, formkey) {
    FormContext.open(form_idx, form, formkey);
    // let e = document.getElementById("lpmx_rows_id");
    //this.scroll_top = e.scrollTop;
  },
  restore_scroll: function () {//FIXME
    // let e = document.getElementById("lpmx_rows_id");
    //  e.scrollTop = this.f;
  },
  scroll: function () {
    let v = $("#lpmx_rows_head_id td.find input").first().val();
    if (!v) v = "";
    const idx = DbFormLpmx.form_lst.findIndex((e) => e[0].startsWith(v, 0));
    const root = document.getElementById("lpmx_rows_id");
    let element = root.querySelector('tr[n="' + idx + '"]');
    if (!element) return;
    element.scrollIntoView();
  },
  scroll2form: function (v, d = 0) {
    //  ricerca su formkey 
    const idx = DbFormLpmx.form_lst.findIndex((e) => e[1].startsWith(v, 0));
    const idx_d = Math.max(0, idx - d);
    const root = document.getElementById("lpmx_rows_id");
    let element = root.querySelector('tr[n="' + idx_d + '"]');
    if (!element) return -1;
    element.scrollIntoView();
    let fk = root.querySelector('tr[n="' + idx + '"]');
    $(fk).addClass("select");
    $(fk).find("td input").first().focus();
    return idx;
  },
};
