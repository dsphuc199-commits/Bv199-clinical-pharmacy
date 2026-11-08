export const copdStyles = `
.copd26 { color:#17364b; font-size:14px; line-height:1.65; min-width:0; }
.copd26 h2 { font-size:21px; margin:0 0 18px; }
.copd26 h3 { font-size:16px; margin:16px 0 10px; }
.copd26 h4 { font-size:15px; margin:18px 0 10px; }
.copd26 p { margin:9px 0; }
.copd26 button,.copd26 select { font:inherit; }
.copd26 button,.copd26 summary { cursor:pointer; }
.copd26 :is(button,summary,select,input,a):focus-visible { outline:3px solid #087f89; outline-offset:3px; }
.copd26 [hidden] { display:none!important; }
.c26-indication { background:#eef7f8; border:1px solid #c8e3e8; border-radius:10px; padding:12px 16px; }
.c26-indication h3 { margin-top:0; }
.c26-branches { display:grid; gap:12px; margin-top:18px; }
.c26-branch-button { display:grid; grid-template-columns:minmax(0,1fr) 24px; align-items:center; gap:10px; width:100%; text-align:left; padding:15px 16px; background:#f5f9fb; border:1px solid #c5dce4; border-radius:9px; color:#17364b; font-weight:700!important; }
.c26-branch-button[aria-expanded="true"] { background:#e5f3f5; border-color:#087f89; }
.c26-branch-button>span:last-child { text-align:center; }
.c26-branch-body { padding:4px 0 12px; }
.c26-group-picker { display:grid; gap:8px; }
.c26-group-picker button { text-align:left; background:white; border:1px solid #d4e2e8; padding:12px; border-radius:8px; color:inherit; }
.c26-group-picker button>span { display:block; font-size:12px; margin-top:3px; }
.c26-group-picker button[aria-pressed="true"] { border-color:#087f89; background:#edf8f8; box-shadow:inset 3px 0 #087f89; }
.c26-card { border:1px solid #cbdde5; border-radius:10px; background:white; overflow:hidden; }
.c26-card header { display:flex; flex-wrap:wrap; gap:8px 16px; justify-content:space-between; padding:10px 14px; background:#eef6f8; }
.c26-card header>span { font-size:12px; }
.c26-dose-grid { display:grid; grid-template-columns:44px minmax(0,1.25fr) minmax(0,1.15fr) minmax(0,1fr) minmax(0,1.1fr); gap:10px; padding:12px 14px 6px 0; align-items:start; }
.c26-dose-grid>div { min-width:0; overflow-wrap:anywhere; }
.c26-field { display:block; font-size:11px; color:#587183; margin-bottom:3px; }
.c26-marker { text-align:center; font-weight:800; color:#087f89; padding-top:18px; }
.c26-or { display:grid; grid-template-columns:44px minmax(0,1fr); margin:8px 0; color:#587183; font-size:12px; }
.c26-or>span { text-align:center; font-weight:700; }
.c26-dose-note,.c26-tools { margin-left:44px!important; margin-right:14px!important; }
.c26-tools { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px; }
.c26-tools>details { flex:1 1 220px; min-width:0; }
.c26-tools>details>summary { display:list-item; padding:6px 10px; color:#076b7c; background:#f1f8fa; border:1px solid #d5e7ec; border-radius:6px; }
.c26-tools>details[open] { flex-basis:100%; padding-bottom:8px; }
.c26-duration,.c26-condition,.c26-card>.c26-source,.c26-card>.c26-review { margin:10px 14px!important; }
.c26-review { padding:8px 12px; background:#fffbeb; border-left:3px solid #d69525; border-radius:4px; font-size:12px; }
.c26-review ul { margin:4px 0; padding-left:18px; }
.c26-source { font-size:12px; margin:12px 0; color:#4b6576; }
.c26-source ul { padding-left:18px; }.c26-source a { color:#08778a; text-decoration:underline; }
.c26-renal { margin:10px 0; }
.c26-renal>div { display:grid; grid-template-columns:minmax(100px,.5fr) minmax(0,1.5fr); gap:10px; padding:7px 0; border-bottom:1px solid #e1ebef; }
.c26-renal dt { font-weight:700; }.c26-renal dd { margin:0; }
.copd26 .c26-notes { list-style:none; padding-left:0; margin:8px 0; }
.copd26 .c26-notes ul { list-style:disc; padding-left:20px; margin:5px 0; }
.copd26 .c26-notes>li { position:relative; padding-left:20px; margin:7px 0; }
.copd26 .c26-notes>li::before { content:"−"; position:absolute; left:0; }
.c26-followup { border-top:1px solid #dce8ed; margin-top:18px; }
.c26-base-picker { display:grid; gap:7px; margin:12px 0; }
.c26-base-picker select { width:100%; min-width:0; padding:10px; border:1px solid #b9d4de; border-radius:7px; background:white; color:inherit; }
.c26-symptoms { font-size:12px; }.copd26 fieldset { border:0; margin:8px 0; padding:0; }
.copd26 label { cursor:pointer; }.copd26 input { margin-right:8px; accent-color:#087f89; }
.copd26 fieldset label { display:inline-flex; align-items:center; margin:6px 18px 6px 0; }
.c26-sr { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; }
@media(max-width:640px) {
 .copd26 { font-size:13px; }.copd26 h2 { font-size:18px; }
 .c26-dose-grid { grid-template-columns:32px minmax(0,1fr); gap:10px 6px; padding-right:10px; }
 .c26-marker { grid-column:1; grid-row:1 / span 4; }
 .c26-dose-grid>div { grid-column:2; }.c26-or { grid-template-columns:32px minmax(0,1fr); }
 .c26-dose-note,.c26-tools { margin-left:38px!important; margin-right:10px!important; }
 .c26-tools { display:grid; }.c26-renal>div { grid-template-columns:minmax(0,1fr); gap:2px; }
 .c26-branch-button { padding:13px 12px; }.c26-indication { padding:12px; }
}
/* UI9: source-specific logic, same flat layout and two-column dose table. */
.copd26 { background:white; border:0; border-radius:0; padding:0; }
.copd26 .c26-indication { background:transparent; border:0; border-radius:0; padding:0; margin:0 0 20px; }
.copd26 .c26-card { border:0; border-radius:0; border-bottom:1px solid #dce8ed; padding:12px 0; }
.copd26 .c26-duration,.copd26 .c26-condition,.copd26 .c26-card>.c26-source,.copd26 .c26-card>.c26-review { margin:10px 0!important; }
.copd26 .c26-tools { margin:8px 0 14px!important; }.copd26 .c26-dose-note { margin:8px 0!important; }
.copd26 .c26-group>h4 { border-top:1px solid #d9e4e9; margin-top:20px; padding-top:20px; font-size:20px; color:#10243e; }
.copd26 h3 { color:#10243e; font-weight:700; }.copd26 .patient-group-selected h3 { font-size:15px; }
`;
