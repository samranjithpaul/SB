import './style.css';
export const metadata={title:'SB · FLAMES',description:'A playful handwritten notebook film.'};
export default function Layout({children}:{children:React.ReactNode}){
 return <html lang="en" style={{background:'black'}}><body>{children}</body></html>;
}
