//Código feito por André Rodrigues
import style from 'styled-components/native'

//Buttons

//Grids
getCol = (valueGrid) =>{
	if(!valueGrid) return;
	const width = valueGrid / 12 * 100;
	return `width: ${width}%;`;
}
const Col = style.View`
    padding: 5px;
    ${({ Value }) => Value && getCol(Value)}
`;
const Row = style.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 auto;
    width: 98%;
`;
//Sections 
const Actions = style.View`
    margin: 20px auto 0 auto;
    width: 350px;
`;
const CleanText = style.Text`
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
`;
const Content = style.View`
    margin: 0 auto;
    width: 98%;
`;
const Containermarcas = style.View`
    border: 1px solid #CFDCDF;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px auto 0 auto;
    padding: 20px 0;
    width: 327px;
`;
const DescriptionOrange = style.Text`
    color: #FF7A61;
    font-size: 20px;
    font-weight: bold;
    padding: 10px 0 40px 0;
    text-transform: uppercase;
    text-align: center;
`;
const DescriptionPurple = style.Text`
    color: #6853C8;
    font-size: 25px;
    font-weight: bold;
    padding: 0 0 20px 0;
    text-align: center;
`;
const LogoTopo = style.Image`
    margin-left: 30px;
`;
const Marcas = style.Image`
    height: 361px;
    margin: 0 auto;
    width: 260px;
`;
const Topo= style.View`
    height: 50px;
    margin: 40px auto 0 auto;
    width: 350px;
`;
const Wrap = style.View`
    margin: 0 auto;
    width: 98%;
`;
export{
    Actions, 
    CleanText,
    Col,
    Content,
    Containermarcas,
    DescriptionOrange,
    DescriptionPurple,
    LogoTopo,
    Marcas,
    Row,
    Topo,
    Wrap
}