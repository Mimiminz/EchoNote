import { useState, useEffect, useRef } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

const ColorPalette = () => {
  const [color, setColor] = useColor("hex", "#121212");
  const [showPalette, setShowPalette] = useState(false);
  const [recentColors, setRecentColors] = useState([]); // 최근 사용한 색상 상태
  const paletteRef = useRef(null);

  // 팔레트 열기/닫기 토글
  const togglePalette = () => {
    setShowPalette(!showPalette);
    if (showPalette) {
      // 팔레트가 닫힐 때 마지막으로 선택한 색상 적용
      if (!recentColors.includes(color.hex)) {
        setRecentColors((prevColors) => [color.hex, ...prevColors].slice(0, 5));
      }
    }
  };

  // 팔레트 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target)) {
        if (showPalette) {
          togglePalette(); // 팔레트를 닫을 때 실행
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [paletteRef, showPalette]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={togglePalette}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: color.hex,
          border: 'none',
          cursor: 'pointer',
        }}
      >
      </button>

      {showPalette && (
        <div 
          ref={paletteRef} 
          style={{ position: 'absolute', zIndex: 2, bottom: '60px', left: '0', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}
        >
          <ColorPicker
            width={300}
            height={150}
            color={color}
            onChange={setColor}
            hideHSV
            dark
            hideInput={["hsv"]}
          />
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '12px', marginBottom: '5px' }}>Recent Colors:</div>
            <div style={{ display: 'flex' }}>
              {recentColors.map((recentColor, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setColor({ hex: recentColor });
                    setShowPalette(false); // 팔레트 닫기
                  }}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: recentColor,
                    marginRight: '5px',
                    cursor: 'pointer',
                    border: recentColor === color.hex ? '2px solid #000' : '1px solid #ccc',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPalette;
