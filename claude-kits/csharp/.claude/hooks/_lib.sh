#!/usr/bin/env bash
# Shared helpers for hooks. Hooks receive the tool call as JSON on stdin.

# json_field <json> <key>  →  value of tool_input.<key> (or a top-level <key>)
# Uses node or python3 when present (handles escaped quotes), falls back to sed.
json_field() {
  if command -v node >/dev/null 2>&1; then
    printf '%s' "$1" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);const v=(j.tool_input||{})[process.argv[1]]??j[process.argv[1]];if(typeof v==="string")process.stdout.write(v)}catch{}})' "$2"
  elif command -v python3 >/dev/null 2>&1; then
    printf '%s' "$1" | python3 -c 'import sys,json
try:
  j=json.load(sys.stdin);v=(j.get("tool_input") or {}).get(sys.argv[1], j.get(sys.argv[1]))
  print(v if isinstance(v,str) else "",end="")
except Exception: pass' "$2"
  else
    printf '%s' "$1" | sed -n "s/.*\"$2\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" | head -1
  fi
}

# block <reason>  →  exit 2 so Claude Code cancels the tool call and shows the reason to Claude
block() {
  echo "$1" >&2
  exit 2
}
