import { css, keyframes, useTheme } from '@emotion/react';

export default function InfinityLogo(props: any) {
  const { devMode } = props;

  const theme: any = useTheme();
  const primary = devMode
    ? theme.palette.text.main
    : theme.palette.primary.main;
  const secondary = devMode
    ? theme.palette.text.main
    : theme.palette.secondary.main;

  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      //   xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 500 313.56"
      // style={devMode ? devModeStyles : {}}
      //   style="enable-background:new 0 0 500 313.56;"
      //   xml:space="preserve"
    >
      <path
        fill="none"
        d="M115.81,255.53l-0.51-0.18c26.42,11.02,56.18,11.01,82.46-0.02l5.01-2.22c10.85-5.18,20.69-12.15,29.26-20.72
	l19.45-19.45l56.07-56.07l5.06-5.06l30.35-30.35l55.69-55.64c-4.15-2.54-8.48-4.82-12.98-6.78c-0.49-0.21-0.98-0.41-1.47-0.61
	l-0.02,0.02c-26.38-11-56.13-11-82.43,0l-2.07,0.92c-0.36,0.16-0.72,0.32-1.08,0.48l-1.89,0.84c-4.18,2-8.21,4.26-12.07,6.77
	c-6.17,4.01-11.91,8.67-17.17,13.92l-20.16,20.16l-55.36,55.36l46.89,46.89l-17.71,17.71c-0.67,0.67-1.36,1.37-2.29,2.18
	c-0.38,0.38-0.8,0.75-1.44,1.33c-0.63,0.59-1.32,1.17-2.12,1.84c-0.91,0.76-1.85,1.55-2.89,2.33c-0.75,0.6-1.52,1.17-2.32,1.71
	l-0.38,0.28c-0.01,0.01-0.03,0.02-0.06,0.04l-1.6,1.11c-0.78,0.54-1.54,1.05-2.25,1.51c-0.38,0.25-0.75,0.49-1.08,0.7l-0.57,0.33
	c-0.57,0.36-1.19,0.7-1.79,1.04l-0.86,0.49c-0.18,0.11-0.37,0.22-0.55,0.32l-44.4-44.4l-55.66,55.66c4.38,2.66,8.96,5.02,13.72,7.04
	C115,255.19,115.4,255.36,115.81,255.53z"
      />
      <path
        fill="none"
        d="M407.26,71.68c0.2,0.15,0.4,0.31,0.6,0.46C407.66,71.99,407.46,71.83,407.26,71.68z"
      />
      <path
        fill="none"
        d="M398.99,66.01c0.3,0.18,0.59,0.37,0.88,0.56C399.57,66.39,399.28,66.2,398.99,66.01z"
      />
      <path
        fill="none"
        d="M402.55,68.33c0.44,0.3,0.89,0.59,1.32,0.89C403.44,68.92,402.99,68.63,402.55,68.33z"
      />
      <path
        fill={primary}
        d="M491.81,107.14c-0.37-1.12-0.76-2.23-1.16-3.34c-0.17-0.47-0.34-0.95-0.52-1.42c-0.11-0.3-0.23-0.61-0.35-0.91
	c-3.01-7.9-6.68-15.65-11.04-23.16l-1.22-2.22c-6.81-11.79-13.9-20.4-23.65-30.15c-9.06-9.06-12.99-12.26-24.08-19.92
	c-0.78-0.54-8.29-4.91-8.29-4.91c-52.21-30.28-117.38-27.9-167.38,6.5c-1.64,1.12-3.25,2.29-4.85,3.48
	c-6.06,4.51-11.84,9.49-17.22,14.87l-8.09,8.09l-12,12L65.39,212.64c8.86,14.4,21.05,26.54,35.49,35.34l55.66-55.66l44.4,44.4
	c0.18-0.1,0.37-0.21,0.55-0.32l0.86-0.49c0.6-0.34,1.21-0.68,1.79-1.04l0.57-0.33c0.33-0.21,0.7-0.45,1.08-0.7
	c0.71-0.46,1.48-0.97,2.25-1.51l1.6-1.11c0.03-0.02,0.05-0.03,0.06-0.04l0.38-0.28c0.8-0.55,1.57-1.12,2.32-1.71
	c1.04-0.78,1.98-1.57,2.89-2.33c0.8-0.68,1.49-1.26,2.12-1.84c0.64-0.58,1.07-0.96,1.44-1.33c0.92-0.81,1.62-1.51,2.29-2.18
	l17.71-17.71l-46.89-46.89l55.36-55.36l20.16-20.16c5.25-5.25,11-9.91,17.17-13.92c3.86-2.51,7.89-4.77,12.07-6.77l1.89-0.84
	c0.36-0.16,0.72-0.32,1.08-0.48l2.07-0.92c26.31-11,56.05-11,82.43,0l0.02-0.02c0.49,0.21,0.99,0.4,1.47,0.61
	c4.5,1.96,8.83,4.24,12.98,6.78l0.01-0.01c0.11,0.07,0.21,0.14,0.32,0.2c0.3,0.18,0.59,0.38,0.88,0.56c0.9,0.57,1.8,1.16,2.69,1.76
	c0.44,0.3,0.89,0.59,1.32,0.89c1.15,0.8,2.27,1.62,3.38,2.45c0.2,0.15,0.4,0.31,0.6,0.46c10.51,8,19.46,17.74,26.2,29.11l-0.01,0.01
	c2.78,4.55,5.24,9.31,7.32,14.27c0.07,0.18,0.14,0.34,0.21,0.5c1.56,3.78,2.89,7.61,3.99,11.49c0.01,0.04,0.02,0.08,0.03,0.12
	c0.21,0.76,0.42,1.52,0.62,2.28c0.03,0.1,0.05,0.21,0.08,0.31c0.41,1.6,0.78,3.2,1.11,4.8c0.04,0.21,0.09,0.43,0.13,0.65
	c0.11,0.57,0.22,1.14,0.33,1.72c0.05,0.26,0.1,0.52,0.14,0.78c0.12,0.67,0.23,1.35,0.33,2.02c0.04,0.28,0.08,0.55,0.12,0.83
	c0.08,0.57,0.17,1.14,0.24,1.72c0.05,0.35,0.09,0.69,0.13,1.04c0.05,0.44,0.1,0.89,0.15,1.33c0.04,0.36,0.08,0.72,0.11,1.08
	c0.06,0.66,0.12,1.32,0.18,1.99c0.03,0.43,0.06,0.85,0.09,1.28c0.03,0.38,0.05,0.75,0.07,1.13c0.03,0.44,0.05,0.88,0.07,1.32
	c0.01,0.31,0.02,0.63,0.04,0.94c0.04,1.02,0.06,2.04,0.07,3.06c0,0.07,0,0.14,0,0.21c0,0.21,0.01,0.41,0.01,0.62
	c0,0.38-0.01,0.77-0.01,1.15c0,0.11,0,0.22,0,0.33c-0.11,8.4-1.2,16.57-3.15,24.4c-0.05,0.19-0.09,0.38-0.14,0.57
	c-0.05,0.19-0.1,0.39-0.15,0.58c-4.67,18.06-14.03,34.96-27.69,48.62c-30.51,30.51-77.13,39.57-116.79,22.96l-23.35,23.35
	c-1.53,1.53-3.09,3.03-4.68,4.51c-1.56,1.45-3.15,2.87-4.77,4.26l-0.31,0.28c-0.35,0.31-0.52,0.46-0.71,0.6
	c-1.21,1.02-2.51,2.1-3.8,3.14l-0.25,0.2l-0.13,0.1c-0.12,0.1-0.24,0.19-0.36,0.28c60.9,35.91,140.19,26.09,190.55-24.28
	c7.7-7.7,14.45-16.02,20.25-24.8c0.25-0.38,0.51-0.77,0.76-1.15c0.19-0.29,0.38-0.59,0.57-0.89c0.61-0.96,1.21-1.93,1.8-2.91
	C501.22,198.69,506.55,150.84,491.81,107.14z"
      />
      <path
        fill={secondary}
        d="M407.86,72.14c-0.2-0.15-0.4-0.31-0.6-0.46c-1.11-0.84-2.24-1.66-3.38-2.45c-0.44-0.3-0.88-0.6-1.32-0.89
	c-0.89-0.6-1.78-1.19-2.69-1.76c-0.29-0.19-0.59-0.38-0.88-0.56c-0.11-0.07-0.22-0.13-0.33-0.19l-55.69,55.64l-30.35,30.35
	l-5.06,5.06l-56.07,56.07l-19.45,19.45c-8.57,8.57-18.41,15.54-29.26,20.72l-5.01,2.22c-26.29,11.03-56.05,11.04-82.46,0.02
	l0.51,0.18c-0.41-0.17-0.81-0.33-1.21-0.51c-4.76-2.02-9.34-4.38-13.72-7.04c-14.45-8.8-26.63-20.93-35.49-35.34
	c-2.82-4.58-5.3-9.38-7.41-14.39c-5.36-12.72-8.33-26.69-8.33-41.36c0-54.48,40.88-99.41,93.64-105.79
	c18.2-2.3,37.03,0.02,54.52,7.32l23.35-23.35c1.32-1.32,2.67-2.61,4.02-3.85c0.44-0.45,1.05-1.01,1.67-1.57
	c1.14-1.09,2.3-2.09,3.48-3.1c0.93-0.8,1.76-1.51,2.64-2.22c0.79-0.71,1.76-1.48,2.74-2.25c-5.95-3.51-12.14-6.64-18.56-9.35
	c-19.32-8.17-39.82-12.32-60.92-12.32c-21.1,0-41.6,4.14-60.92,12.32c-18.64,7.88-35.37,19.16-49.72,33.51
	c-7.85,7.85-14.78,16.42-20.74,25.62C-0.98,112.25-7.07,163.08,8.44,208.36c0.21,0.6,0.42,1.21,0.64,1.81
	c0.05,0.15,0.11,0.31,0.16,0.46c0.88,2.41,1.83,4.81,2.83,7.18c2.57,6.07,5.5,11.93,8.77,17.58c2.64,4.55,5.51,8.95,8.59,13.21
	c3.64,5.02,7.57,9.84,11.81,14.43c1.41,1.53,2.86,3.04,4.34,4.51c1.51,1.51,3.04,2.98,4.6,4.42c4.68,4.32,9.59,8.32,14.71,12.01
	c4.27,3.07,13.09,8.71,13.09,8.71c51.59,29.75,118.24,27.34,167.4-6.46c7.76-5.33,15.19-11.52,22.07-18.4l19.94-19.94l146.66-146.6
	C427.18,90.01,418.28,80.13,407.86,72.14z"
      />
    </svg>
  );
}
