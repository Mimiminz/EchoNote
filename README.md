<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=200&section=header&text=Echo%20Note&fontSize=70&animation=fadeIn" />

### 🏆 **삼성 청년 SW 아카데미(SSAFY) 11기 - 특화 우수 프로젝트**

# 📝Echo Note

**Echo Note**는 AI를 통한 녹음 분석과 필기를 합쳐 사용자의 효율적인 학습을 돕는 노트 서비스입니다.

사용자들은 강의를 녹음하고, 녹음된 음성을 STT와 AI 음성 분석 기능을 통해 효율적으로 학습할 수 있습니다.

---

## 💻 프로젝트 주요 기능

### 🔊 **STT 분석**

- 사용자는 강의를 녹음한 음성을 STT 분석을 통해 문장별 타임라인과 텍스트를 제공합니다.
- 타임라인을 클릭 시 해당 시간에 기록하던 페이지로 매핑 기능을 제공합니다.
- STT 분석을 통해 추출된 스크립트에서 사전에 등록된 키워드를 강조할 수 있습니다.

### 🤖 **AI 음성 분석**

- 녹음된 음성에서 강세를 파악하여, 강조된 음성임을 파악하고 해당 부분을 하이라이트 하는 기능을 제공합니다.

### ✏ **자유로운 필기 기능 및 타임라인 매핑**

- 사용자는 펜, 도형 등 다양한 기능을 사용하여 원하는 곳에 필기가 가능합니다.
- 펜툴 메모를 올가미 기능을 통해 클릭 할 시 해당 메모를 작성하던 시간대의 타임라인으로 녹음 및 스크립트가 이동됩니다.
- 선택된 텍스트 박스 및 도형은 툴바를 통해 녹음본의 타임라인으로 이동할 수 있습니다.

---

## 📱 서비스 화면

### 📄 PDF 업로드

PDF 파일을 업로드하고 강조 표시를 받을 태그를 추가할 수 있습니다.

<table>
<tr>
    <td align="center">
        <img src="./docs/assets/업로드_제목PDF선택.gif" alt="제목 입력 및 PDF 선택" >
        <p><strong>제목 입력 및 PDF 선택</strong></center></p>
    </td>
    <td align="center">
        <img src="./docs/assets/업로드_태그추가.gif" alt="태그 추가" >
        <p><strong>태그 추가</strong></center></p>
    </td>
</tr>
</table>

---

### 🎨 필기

펜툴을 이용하여 필기를 진행하고 녹음본 스크립트와 타임라인을 매핑할 수 있습니다.

<table>
<tr>
    <td align="center">
        <img src="./docs/assets/필기.gif" alt="펜툴 필기" >
        <p><strong>펜툴</strong></center></p>
    </td>
    <td align="center">
        <img src="./docs/assets/필기_지우개.gif" alt="펜툴 지우개" >
        <p><strong>지우개</strong></center></p>
    </td>
</tr>
<tr>
    <td align="center">
        <img src="./docs/assets/필기_실행취소다시실행전체삭제.gif" alt="전체 삭제 및 실행 취소 다시 실행" >
        <p><strong>실행 취소 | 다시 실행 | 전체 삭제</strong></center></p>
    </td>
    <td align="center">
        <img src="./docs/assets/필기_스크립트매핑.gif" alt="필기와 스크립트 타임라인 매핑" >
        <p><strong>필기와 스크립트 타임라인 매핑</strong></p>
    </td>
</tr>
</table>

### 🆎 텍스트

텍스트 박스를 추가하여 필기를 진행하고 녹음본 타임라인과 매핑할 수 있습니다.

<table>
<tr>
    <td align="center">
        <img src="./docs/assets/텍스트_입력.gif" alt="텍스트 입력" >
        <p><strong>텍스트 입력</strong></p>
    </td>
    <td align="center">
        <img src="./docs/assets/텍스트_편집.gif" alt="텍스트 수정" >
        <p><strong>텍스트 편집</strong></p>
    </td>
</tr>
<tr>
    <td align="center">
        <img src="./docs/assets/텍스트_삭제.gif" alt="텍스트 삭제" >
        <p><strong>텍스트 박스 삭제</strong></p>
    </td>
    <td align="center">
        <img src="./docs/assets/텍스트녹음_매핑.gif" alt="텍스트와 녹음 매핑" >
        <p><strong>텍스트와 녹음본 타임라인 매핑</strong></p>
    </td>
<tr>
</table>

### 🔷 도형

도형을 그리고 녹음본 타임라인과 매핑할 수 있습니다.

<table>
<tr>
    <td align="center">
        <img src="./docs/assets/도형그리기.gif" alt="도형 그리기" >
        <p><strong>도형 그리기</strong></p>
    </td>
    <td align="center">
        <img src="./docs/assets/도형지우기.gif" alt="도형 지우기" >
        <p><strong>도형 지우기</strong></p>
    </td>
</tr>
<tr>
    <td align="center">
        <img src="./docs/assets/사각형그리기.gif" alt="녹음 중 도형 그리기" >
        <p><strong>녹음 중 도형 그리기</strong></p>
    </td>
    <td align="center">
        <img src="./docs/assets/도형매핑.gif" alt="도형과 녹음본 매핑" >
        <p><strong>도형과 녹음본 타임라인 매핑</strong></p>
    </td>
</tr>
</table>

---

### 💬 STT

녹음을 진행하고 타임라인과 함께 스크립트를 추출할 수 있습니다.

<img src="./docs/assets/STT.gif">

### 🕒 타임라인 매핑

문장별 타임라인을 통해 녹음본을 다시 듣고 녹음 당시의 페이지로 이동할 수 있습니다.

<img src="./docs/assets/타임라인_페이지_매핑.gif">

### ❗ 하이라이트

<table>
<tr>
    <td align="center">
        <img src="./docs/assets/키워드강조.gif">
        <p><strong>키워드 강조</strong></p>
    </td>
    <td align="center">
        <img src="./docs/assets/강조표시.gif">
        <p><strong>음성 분석 하이라이트</strong></p>
    </td>
</tr>
</table>

---

## 🧑🏻‍💻 팀원

### Client

|                                                     조민주                                                      |                                                   박다솔                                                    |                                                   최예헌                                                    |
| :-------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| <a href="https://github.com/mimiminz"><img src="https://avatars.githubusercontent.com/mimiminz" width=160/></a> | <a href="https://github.com/ds10x2"><img src="https://avatars.githubusercontent.com/ds10x2" width=160/></a> | <a href="https://github.com/honi20"><img src="https://avatars.githubusercontent.com/honi20" width=160/></a> |
|                                     [mimiminz](https://github.com/mimiminz)                                     |                                     [ds10x2](https://github.com/ds10x2)                                     |                                     [honi20](https://github.com/honi20)                                     |

### Server

|                                                     신지연                                                      |                                                      이현주                                                       |                                                      이은우                                                       |
| :-------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------: |
| <a href="https://github.com/Nooroong"><img src="https://avatars.githubusercontent.com/Nooroong" width=160/></a> | <a href="https://github.com/Labriever"><img src="https://avatars.githubusercontent.com/Labriever" width=160/></a> | <a href="https://github.com/clairew99"><img src="https://avatars.githubusercontent.com/clairew99" width=160/></a> |
|                                     [Nooroong](https://github.com/Nooroong)                                     |                                     [Labriever](https://github.com/Labriever)                                     |                                     [clairew99](https://github.com/clairew99)                                     |

---

## ⚒️ 기술 스택

## 🖥️ Client

[![Client Skills](https://skillicons.dev/icons?i=react,javascript,styledcomponents,vscode&theme=dark)](https://skillicons.dev)

## 🖥️ Server

[![Server Skills](https://skillicons.dev/icons?i=java,spring,mysql,mongo,aws,idea&theme=dark)](https://skillicons.dev)

## 🖥️ AI

[![AI Skills](https://skillicons.dev/icons?i=&theme=dark)](https://skillicons.dev)

## 🖥️ Devops

[![Data Skills](https://skillicons.dev/icons?i=aws,docker,jenkins,nginx&theme=dark)](https://skillicons.dev)

## 🖥️ Common

[![Common Skills](https://skillicons.dev/icons?i=notion,figma,git,gitlab&theme=dark)](https://skillicons.dev)

---
