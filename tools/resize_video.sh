#!/usr/bin/env bash
# Encode video to the portfolio's house spec and drop it into public/.
#
#   Single file:  ./resize_video.sh <video-file> [repo-root]
#   Batch:        ./resize_video.sh --auto [repo-root]
#
# --auto picks up every video sitting next to this script, encodes each into
# <repo>/public/, then deletes the source. A source is only ever removed after
# ffmpeg exits clean AND ffprobe confirms a real video stream in the output.
#
# House spec (matches every other case video in public/):
#   540x960 (9:16), H.264 High, yuv420p, 30 fps, ~1250 kb/s video,
#   AAC-LC 44.1 kHz stereo 96 kb/s, +faststart for web streaming.
#
# Framing: the source is scaled to cover 540x960 and centre-cropped, so the
# tile is filled edge to edge with no black bars. Set FIT=pad to letterbox
# instead if the crop cuts off something important.
#
# Output names are slugified for the web (Cyrillic transliterated, lowercase,
# dashes) because these land in public/ and get served over HTTP. Use
# --keep-names to write the original basename instead.
#
# Options:
#   -a, --auto         batch mode: every video next to this script
#   -y, --yes          skip the confirmation prompt in --auto
#   -n, --dry-run      print the plan; encode nothing, delete nothing
#   -k, --keep-names   keep original filenames instead of slugifying
#   -o, --output NAME  single-file mode: output basename inside public/
#   -h, --help         this text

set -euo pipefail

VIDEO_EXT="mp4 mov m4v mkv avi webm mts m2ts"
FIT=${FIT:-crop}

usage() {
  sed -n '2,31p' "$0" | sed 's/^# \{0,1\}//'
}

die() { printf 'error: %s\n' "$*" >&2; exit 1; }

# --- resolve the directory this script actually lives in (follow symlinks) ---
SELF=${BASH_SOURCE[0]}
while [ -L "$SELF" ]; do
  link_dir=$(cd -P "$(dirname "$SELF")" && pwd)
  SELF=$(readlink "$SELF")
  case $SELF in
    /*) ;;
    *) SELF=$link_dir/$SELF ;;
  esac
done
SCRIPT_DIR=$(cd -P "$(dirname "$SELF")" && pwd)

# --- args ---
AUTO=0
ASSUME_YES=0
DRY_RUN=0
KEEP_NAMES=0
OUT_NAME=""
POS1=""
POS2=""

while [ $# -gt 0 ]; do
  case $1 in
    -a|--auto)       AUTO=1 ;;
    -y|--yes)        ASSUME_YES=1 ;;
    -n|--dry-run)    DRY_RUN=1 ;;
    -k|--keep-names) KEEP_NAMES=1 ;;
    -o|--output)
      [ $# -ge 2 ] || die "--output requires a name"
      shift; OUT_NAME=$1 ;;
    -h|--help)       usage; exit 0 ;;
    --)              shift; break ;;
    -*)              die "unknown option: $1 (try --help)" ;;
    *)
      if   [ -z "$POS1" ]; then POS1=$1
      elif [ -z "$POS2" ]; then POS2=$1
      else die "too many arguments"
      fi ;;
  esac
  shift
done

command -v ffmpeg  >/dev/null 2>&1 || die "ffmpeg not found in PATH"
command -v ffprobe >/dev/null 2>&1 || die "ffprobe not found in PATH"

case "$FIT" in
  crop) VF="scale=540:960:force_original_aspect_ratio=increase,crop=540:960,fps=30" ;;
  pad)  VF="scale=540:960:force_original_aspect_ratio=decrease,pad=540:960:(ow-iw)/2:(oh-ih)/2:black,fps=30" ;;
  *)    die "FIT must be 'crop' or 'pad'" ;;
esac

# --- helpers ---

# Transliterate + slugify a basename so it is safe to serve over HTTP.
slugify() {
  printf '%s' "$1" | sed \
    -e 's/Ё/E/g; s/ё/e/g; s/Ж/Zh/g; s/ж/zh/g; s/Х/Kh/g; s/х/kh/g' \
    -e 's/Ц/Ts/g; s/ц/ts/g; s/Ч/Ch/g; s/ч/ch/g; s/Щ/Shch/g; s/щ/shch/g' \
    -e 's/Ш/Sh/g; s/ш/sh/g; s/Ю/Yu/g; s/ю/yu/g; s/Я/Ya/g; s/я/ya/g' \
    -e 's/Й/J/g; s/й/j/g; s/Э/E/g; s/э/e/g; s/Ы/Y/g; s/ы/y/g' \
    -e 's/[ЪЬъь]//g' \
    -e 's/А/A/g; s/а/a/g; s/Б/B/g; s/б/b/g; s/В/V/g; s/в/v/g' \
    -e 's/Г/G/g; s/г/g/g; s/Д/D/g; s/д/d/g; s/Е/E/g; s/е/e/g' \
    -e 's/З/Z/g; s/з/z/g; s/И/I/g; s/и/i/g; s/К/K/g; s/к/k/g' \
    -e 's/Л/L/g; s/л/l/g; s/М/M/g; s/м/m/g; s/Н/N/g; s/н/n/g' \
    -e 's/О/O/g; s/о/o/g; s/П/P/g; s/п/p/g; s/Р/R/g; s/р/r/g' \
    -e 's/С/S/g; s/с/s/g; s/Т/T/g; s/т/t/g; s/У/U/g; s/у/u/g' \
    -e 's/Ф/F/g; s/ф/f/g' \
    | tr '[:upper:]' '[:lower:]' \
    | sed -e 's/[^a-z0-9]\{1,\}/-/g' -e 's/^-*//' -e 's/-*$//'
}

# Output basename for a given source path.
out_name_for() {
  src_base=$(basename "$1")
  stem=${src_base%.*}
  if [ "$KEEP_NAMES" -eq 1 ]; then
    printf '%s.mp4' "$stem"
  else
    slug=$(slugify "$stem")
    [ -n "$slug" ] || slug="video"
    printf '%s.mp4' "$slug"
  fi
}

is_video() {
  base=$(basename "$1")
  case $base in *.*) ;; *) return 1 ;; esac
  ext=$(printf '%s' "${base##*.}" | tr '[:upper:]' '[:lower:]')
  case " $VIDEO_EXT " in
    *" $ext "*) return 0 ;;
    *) return 1 ;;
  esac
}

encode() {
  ffmpeg -y -loglevel error -stats -i "$1" \
    -vf "$VF" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -b:v 1250k -maxrate 1500k -bufsize 2500k \
    -preset slow -g 60 -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -c:a aac -b:a 96k -ar 44100 -ac 2 \
    -movflags +faststart \
    "$2"
}

# Refuse to call an encode successful unless the file is really a video.
verify() {
  [ -s "$1" ] || return 1
  streams=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_type \
    -of default=nw=1:nk=1 "$1" 2>/dev/null) || return 1
  [ "$streams" = "video" ] || return 1
  dur=$(ffprobe -v error -show_entries format=duration \
    -of default=nw=1:nk=1 "$1" 2>/dev/null) || return 1
  awk -v d="$dur" 'BEGIN { exit !(d + 0 > 0) }' || return 1
  return 0
}

report() {
  printf '\n  %s\n' "$1"
  ffprobe -v error -show_entries format=duration:stream=codec_name,width,height \
    -of default=nw=1 "$1" 2>/dev/null | sed 's/^/    /'
}

# ============================ single-file mode ============================
if [ "$AUTO" -eq 0 ]; then
  [ -n "$POS1" ] || { usage >&2; exit 2; }
  SRC=$POS1
  [ -f "$SRC" ] || die "not a file: $SRC"

  REPO=${POS2:-$(cd -P "$SCRIPT_DIR/.." && pwd)}
  OUT_DIR="$REPO/public"
  [ -d "$OUT_DIR" ] || die "no such directory: $OUT_DIR"

  if [ -n "$OUT_NAME" ]; then
    OUT="$OUT_DIR/$OUT_NAME"
  else
    OUT="$OUT_DIR/$(out_name_for "$SRC")"
  fi

  if [ "$DRY_RUN" -eq 1 ]; then
    printf 'dry run: %s -> %s\n' "$SRC" "$OUT"
    exit 0
  fi

  encode "$SRC" "$OUT"
  verify "$OUT" || die "output failed verification: $OUT"
  printf '\nWrote %s\n' "$OUT"
  report "$OUT"
  exit 0
fi

# =============================== auto mode ================================
[ -z "$OUT_NAME" ] || die "--output only applies to single-file mode"

REPO=${POS1:-$(cd -P "$SCRIPT_DIR/.." && pwd)}
OUT_DIR="$REPO/public"
[ -d "$OUT_DIR" ] || die "no such directory: $OUT_DIR"

OUT_DIR_ABS=$(cd -P "$OUT_DIR" && pwd)
[ "$OUT_DIR_ABS" != "$SCRIPT_DIR" ] \
  || die "output directory is the source directory; that would delete what we just wrote"

shopt -s nullglob
SRCS=()
OUTS=()
for f in "$SCRIPT_DIR"/*; do
  [ -f "$f" ] || continue
  is_video "$f" || continue
  SRCS[${#SRCS[@]}]=$f
  OUTS[${#OUTS[@]}]=$(out_name_for "$f")
done
shopt -u nullglob

if [ ${#SRCS[@]} -eq 0 ]; then
  printf 'No videos found in %s\n' "$SCRIPT_DIR"
  printf 'Looked for: %s\n' "$VIDEO_EXT"
  exit 0
fi

# Two sources collapsing to one output name would destroy data on delete.
i=0
while [ $i -lt ${#OUTS[@]} ]; do
  j=$((i + 1))
  while [ $j -lt ${#OUTS[@]} ]; do
    [ "${OUTS[$i]}" != "${OUTS[$j]}" ] \
      || die "name collision: '$(basename "${SRCS[$i]}")' and '$(basename "${SRCS[$j]}")' both map to '${OUTS[$i]}'"
    j=$((j + 1))
  done
  i=$((i + 1))
done

printf 'Source:  %s\n' "$SCRIPT_DIR"
printf 'Target:  %s\n\n' "$OUT_DIR_ABS"
printf '%d video(s) to process:\n\n' "${#SRCS[@]}"

overwrites=0
i=0
while [ $i -lt ${#SRCS[@]} ]; do
  note=""
  if [ -e "$OUT_DIR/${OUTS[$i]}" ]; then
    note="  [overwrites existing]"
    overwrites=$((overwrites + 1))
  fi
  printf '  %s\n      -> public/%s%s\n' "$(basename "${SRCS[$i]}")" "${OUTS[$i]}" "$note"
  i=$((i + 1))
done

printf '\nSources are deleted after each successful encode.\n'
[ "$overwrites" -eq 0 ] || printf '%d existing file(s) in public/ will be replaced.\n' "$overwrites"

if [ "$DRY_RUN" -eq 1 ]; then
  printf '\nDry run: nothing encoded, nothing deleted.\n'
  exit 0
fi

if [ "$ASSUME_YES" -eq 0 ]; then
  [ -t 0 ] || die "not a terminal; re-run with --yes to confirm deletion non-interactively"
  printf '\nProceed? [y/N] '
  read -r reply
  case $reply in
    y|Y|yes|YES) ;;
    *) printf 'Aborted.\n'; exit 1 ;;
  esac
fi

ok=0
failed=0
FAILED_NAMES=""

i=0
while [ $i -lt ${#SRCS[@]} ]; do
  src=${SRCS[$i]}
  out="$OUT_DIR/${OUTS[$i]}"
  printf '\n[%d/%d] %s\n' "$((i + 1))" "${#SRCS[@]}" "$(basename "$src")"

  if encode "$src" "$out" && verify "$out"; then
    rm -f -- "$src"
    ok=$((ok + 1))
    printf '  wrote public/%s, removed source\n' "${OUTS[$i]}"
    report "$out"
  else
    failed=$((failed + 1))
    FAILED_NAMES="$FAILED_NAMES  $(basename "$src")"$'\n'
    printf '  FAILED — source kept\n' >&2
  fi
  i=$((i + 1))
done

printf '\n----\n%d succeeded, %d failed\n' "$ok" "$failed"
if [ "$failed" -gt 0 ]; then
  printf 'kept:\n%s' "$FAILED_NAMES"
  exit 1
fi
