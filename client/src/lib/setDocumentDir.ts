// Sets the document direction (dir) attribute for RTL/LTR languages.
// This ensures the UI is displayed correctly for the selected language.
export function setDocumentDir(dir: 'ltr' | 'rtl' = 'ltr') {
  document.dir = dir;
}
