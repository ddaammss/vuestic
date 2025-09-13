export const getImageUrl = (path) => {
  // '/uploads/store/20250911_235325_이미지 (1).png'
  if (!path) return '';

  if (path.startsWith('http')) {
    return path;
  }

  const baseUrl =  'https://amita86tg.duckdns.org' ;
  //const baseUrl =  'http://localhost:8080';
  return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
};
