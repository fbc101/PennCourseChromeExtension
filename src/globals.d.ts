import Chrome from 'chrome';

declare global {
  namespace NodeJS {
    interface Global {
      chrome: typeof Chrome;
    }
  }
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}