/* jshint esversion: 8 */
//release 22-04-22

// let T0 = 0;
// var start_performance = function () {
//   T0 = performance.now();
// };
// var log_performance = function (msg = '') {
//   const t1 = performance.now();
//   cmd_log_show(msg + " : " + (t1 - T0));
//   T0 = performance.now();
// };

var cmd_close = function () {
  if (confirm("Chiudi Applicazione ?")) window.close();
};

var cmd_log_toggle = function () {
  UaLog.toggle();
};

var cmd_log = function (...args) {
  UaLog.log(...args);
};

var cmd_log_show = (...args) => {
  UaLog.log_show(...args);
};

var cmd_show_store = () => {
  UaLog.log_show("-------------");
  const store_name = window.localStorage.getItem(KEY_TEXT_NAME) || "";
  const store_text = window.localStorage.getItem(KEY_DATA) || "";
  let size = store_text.length;
  let s = `${store_name}:  ${size}`;
  UaLog.log(s);
  const store_dupl = window.localStorage.getItem(KEY_OMOGR) || "";
  //const ks=DbFormLpmx.load_omogr_json.keys();
  size = store_dupl.length;
  s = `omografi:${size}`;
  UaLog.log(s);
  UaLog.log("-------------");
};

var cmd_wait_start = function () {
  document.querySelector("body").classList.add("wait");
};

var cmd_wait_stop = function () {
  document.querySelector("body").classList.remove("wait");
};

var cmd_notify_link = function (p, e, dx, dy, ...args) {
  Notify.link_element(p, e, dx, dy).wait(5000).show(...args);
};

var cmd_notify_at = function (x, y, ...args) {
  Notify.at(x, y).wait(5000).show(...args);
};

var cmd_notify = function (...args) {
  Notify.center().wait(5000).show(...args);
};

var cmd_notify_hide = function () {
  Notify.hide();
};

var get_time = function () {
  const today = new Date();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return time;
};
var sleep = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

var relocate = () => {
  PosMsd.resetXY();
  Msd.resetXY();
  Phon.resetXY();
  Funct.resetXY();
  FormContext.resetXY();
  FormOmogr.resetXY();
};


var UAPUNCTS = `,.;::?!^~()[]{}<>=+-*#@£&%/«»“‘’"\`'`;
let ALPHABETIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzàèéìòù";
let NUMERIC = "0123456789";
var ULACHARSET = ALPHABETIC + NUMERIC;

//corpus con formkey duplicate
var KEY_OMOGR = "ula_omogr";
// nome testo nello store
var KEY_TEXT_NAME = "ula_text_name";
// nome testo attivo
const store_text_name = window.localStorage.getItem(KEY_TEXT_NAME);
let TEXT_NAME = store_text_name || "";
// nome dati
var KEY_DATA = "ula_data";

// url data
var URL_TEXT_LIST = "/data/text_list.txt";
var DATA_DIR = "/data";
var URL_CORPUS_OMOGR = "/data_corpus/corpus_omogr.json";

let LPMX_ID = null;
let TEXT_ID = null;

var Ula = {
  open:async function () {
    cmd_wait_start();
    LPMX_ID = document.getElementById("lpmx_id");
    TEXT_ID = document.getElementById("text_id");
    UaLog.setXY(-300, 0).setZ(11).new();
    if (!TEXT_NAME) {
      // se TEXT_NAME null prende il primo della lista
      DbFormLpmx.clear_store();
      const lst = await DbFormLpmx.load_text_list();
      const name = (lst.length > 0) ? lst[0] : "";
      TEXT_NAME = name;
    }
    DbFormLpmx.set_text_name(TEXT_NAME);
    let ok = await DbFormLpmx.get_data();
    if (!ok) {
      alert(TEXT_NAME + "  Not Found.");
    }
    TEXT_ID.style.display = 'none';
    await FormLpmx.open();
    await PosMsd.open();
    await Phon.open();
    await Funct.open();
    await FormText.open();
    cmd_wait_stop();
    relocate()
  },
  show_lpmx: async function () {
    TEXT_ID.style.display = 'none';
    LPMX_ID.style.display = 'block';
  },
  show_text: async function () {
    //DbFormLpmx.fill_rows_text();
    LPMX_ID.style.display = 'none';
    TEXT_ID.style.display = 'block';
  },
};
