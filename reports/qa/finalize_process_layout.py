from pathlib import Path
from docx import Document
from docx.shared import Pt
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

f=next(p for p in (Path(__file__).resolve().parents[2]/'reports').glob('*пользователя.docx') if not p.name.startswith('~'))
d=Document(f)
for style in [d.styles[n] for n in ['Title','Heading 1','Heading 2','Heading 3']]:
    for border in style.element.xpath('.//w:pBdr'):
        border.getparent().remove(border)
    rf=style.element.get_or_add_rPr().find(qn('w:rFonts'))
    if rf is not None:
        for key in list(rf.attrib):
            if key.endswith('Theme'): del rf.attrib[key]
        for key in ['ascii','hAnsi','cs','eastAsia']: rf.set(qn('w:'+key),'Times New Roman')
if 'ContentsHeading' not in d.styles:
    st=d.styles.add_style('ContentsHeading',WD_STYLE_TYPE.PARAGRAPH)
    st.base_style=d.styles['Heading 1']
    ol=OxmlElement('w:outlineLvl'); ol.set(qn('w:val'),'9'); st.element.get_or_add_pPr().append(ol)
for p in d.paragraphs:
    if p.text == 'Содержание' and p.style.name=='Heading 1': p.style=d.styles['ContentsHeading']
    if any(p.text.startswith(label) for label in ['Цель. ','Предусловия. ','Основной сценарий. ','Альтернативные сценарии. ','Результат. ']):
        p.text=p.text
    # Avoid almost empty spill pages at chapter ends.
    if p.text.startswith(('Этап 1 — анализ','Приёмка проводится','Условия и пороги приёмки','Модель описывает предлагаемую реализацию')):
        p.paragraph_format.line_spacing=1.3
    if not p.text and p._p.getprevious() is not None and p._p.getprevious().tag==qn('w:tbl'):
        p.paragraph_format.line_spacing=Pt(6)
        p.paragraph_format.space_after=Pt(0)
        p.paragraph_format.space_before=Pt(0)
d.save(f)
print('Layout adjusted')
