/* jshint esversion: 8 */

const h_menu_text = `
<div id="text_menu_id" class="menu_bar" >
  <ul>
    <li class="v"> 
      <a class="tipb" cmd="show_lpmx" href="#">Form 
          <span class="tiptextb">Visualizza Lista Form</span>
      </a> 
   </li>  
   <li class="v"> 
     <a class="tipb" cmd="toggle_row" href="#">Toggle Row
       <span class="tiptextb">Apre/Chiude la finestra della riga</span>
    </a> 
   </li>
      <li class="v"> 
      <a class="tipb" cmd="fillter_rows_text" href="#">Find
        <span class="tiptextb">Seleziona righe  </span>
      </a> 
    </li>
    <li class="v"> 
      <a class="tipb" cmd="show_text" href="#">Text
        <span class="tiptextb">Visualizza tutto il Testo </span>
      </a> 
    </li>
    <li class="v">   
      <a class=" href="#">Utils</a>
      <ul class="v">
        <li class="h">
          <a class="tipr" cmd="cmd_log" href="#">Log
            <span class="tiptextr">Relocate all Windows</span>
          </a>
        </li>
        <li class="h">
          <a class="cmd tipr" cmd="resetxy" href="#">Relocate
          </a>
        </li>
    </ul>
   </li>
   <li class="v"> <a cmd="help" href="#">Help</a> </li>
   <li class="v"> <a cmd="close" href="#">close</a> </li>
  </ul>
</div>
`;


const form_lemma_filter = `
<div class="input_table">

  <div class="input_row">
  <div class="input_col">Form(i):</div>
    <div class="input_col">
      <input type="text" value="" size="4" name="formkey" >
    </div>
  </div>

  <div class="input_row">
    <div class="input_col">Form:</div>
    <div class="input_col">
      <input type="text" value="" size="4" name="form" >
    </div>
  </div>
  
  <div class="input_row">
    <div class="input_col">Lemma:</div>
    <div class="input_col">
      <input type="text" value="" size="4" name="lemma" >
    </div>
  </div>

  <div class="input_row">
    <div class="input_col">Etimo:</div>
    <div class="input_col">
      <input type="text" value="" size="4" name="etimo" >
    </div>
  </div>

  <div class="input_row">
    <div class="input_col">POS:</div>
    <div class="input_col">
      <input type="text" value="" size="4" name="pos" >
    </div>
  </div>

  <div class="input_row">
    <div class="input_col">LANG:</div>
    <div class="input_col">
      <input type="text" value="" size="4" name="phon" >
    </div>
  </div>

</div>
`;


var FormText = {
  id: "text_id",
  text_all: true,
  exe: function (cmd) {
    switch (cmd) {
      case "show_lpmx":
        Ula.show_lpmx();
        break;
      case "fillter_rows_text":
        this.fillter_rows_text();
        break;
      case "show_text":
        this.show_text();
        break;
      case "toggle_row":
        FormTextRow.toggle();
        break;
      case "enable_row":
        this.enable_row();
        break;
      case "disable_row":
        this.disable_row();
        break;
      case "help":
        Help.toggle("help2.html");
        break;
      case "resetxy":
        FormTextRow.resetXY();
        break;
      case "cmd_log":
        cmd_log_toggle();
        break;
      case "close":
        cmd_close();
        break;
      default:
        alert("command not found.");
    }
  },
  open: function () {
    DbFormLpmx.fill_rows_text();
    let jt = UaJt();
    jt.append(h_menu_text + "<div id='text_rows_id'></div>");
    const html = jt.html();
    $("#" + this.id).html(html);
    this.bind_menu();
    this.rows_text2html();
  },
  data2html:function(){
    DbFormLpmx.fill_rows_text();
    this.rows_text2html();
  },
  fillter_rows_text: function () {

    let input_call = (js) => {
      DbFormLpmx.filter_rows_js(js);
      if (DbFormLpmx.rows_js.length == 0) {
        Notify.center().wait(5000).show("Empty Selection.");
        return;
      }
      this.rows_text2html();
      this.text_all = false;
    };

    RowsInput.open("text_id", "text_input_filter_id", form_lemma_filter, {}, input_call).at(200, 100);
    RowsInput.show();
  },
  show_text: function () {
    if (this.text_all) {
      Notify.center().wait(5000).show("Full Text.");
    }
    else {
      this.data2html();
      this.text_all = true;
    }
  },
  rows_text2html: function () {
    const rows = DbFormLpmx.rows_js;
    let jt = UaJt();
    let row_h = `
    <div class='row table-row'>
        <div class='n' >{row_n}</div>
        <div class='text'>{row_text}</div>
   </div>
    `;
    for (let r of rows) {
      let d = {
        "row_n": r.row_n,
        "row_text": r.row_text
      };
      jt.append(row_h, d);
    }
    let html = jt.html();
    document.getElementById("text_rows_id").innerHTML = html;
    this.bind_row();
  },
  open_row: function () {
    let e = $("#text_rows_id div.select");
    let n = '0';
    if (!!e)
      n = e.html();
    let w_lst = DbFormLpmx.get_row_token_form(n);
    // evidenzia token trovati con find
    if (!this.text_all) {
      let r = e.parent().get(0);
      let lst = r.querySelectorAll("span");
      for (let x of lst) {
        const h = x.innerHTML;
        for (let w of w_lst) {
          if (w.t == h)
            w.find = "find";
        }
      }
    }
    FormTextRow.open(n, w_lst);
  },
  bind_menu: function () {
    const menu = document.getElementById("text_menu_id");
    const call = (ev) => {
      const t = ev.target;
      if (t.tagName == 'A') {
        const cmd = t.getAttribute("cmd");
        if (!!cmd) {
          // alert(cmd);
          this.exe(cmd);
        }
      }
    };
    menu.addEventListener("click", call);
  },
  bind_row: function () {
    $("#text_rows_id").off("click");
    $("#text_rows_id")
      .on("click ", "div", {}, function (event) {
        //event.preventDefault();
        event.stopImmediatePropagation();
        $("#text_rows_id div.select").removeClass("select");
        $(event.currentTarget).parent().find("div.n").addClass("select");
        FormText.open_row();
      });
  },
  enable_row: function () {
    $("#text_rows_id").off("mouseover");
    $("#text_rows_id")
      .on("mouseover ", "div.n", {}, function (event) {
        //event.preventDefault();
        $("#text_rows_id div.select").removeClass("select");
        $(event.currentTarget).addClass("select");
        FormText.open_row();
      });
  },
  disable_row: function () {
    $("#text_rows_id").off("mouseover");
  }
};
