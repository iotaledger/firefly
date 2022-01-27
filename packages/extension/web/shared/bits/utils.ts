
const cssPxNames = ['width','height','fontSize','marginLeft','marginRight','marginTop','marginBottom','borderRadius','top','right','left','bottom']
function unitify(rule:string, value:any){
  if(cssPxNames.includes(rule) && typeof value==='number') return 'px'
  return ''
}
export function css(style) {
  return Object.keys(style).reduce((acc, key) => (
      acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + unitify(key,style[key]) + ';'
  ), '');
};