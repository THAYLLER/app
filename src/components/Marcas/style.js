//Código feito por André Rodrigues
import style from 'styled-components/native'

const Header = style.View`
    background-color: #6853C8;
    display: flex;
    flex-direction: row;
    align-items: center;
    min-height: 80px;
`;
const ContainerMenu = style.View`
    width: 10%;
`;
const ContainerLogo = style.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 80%;
`;
const Rowmarcas = style.View`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
    width: 95%;
`;
const Gridmarcas = style.View`
    border: 1px solid #CFDCDF;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;
    min-height: 80px;
    width: 100px;
`;
const Template = style.SafeAreaView`
    background-color: #6853C8;
    height: 100%;
`;
export {
    ContainerLogo,
    ContainerMenu,
    Gridmarcas,
    Header,
    Rowmarcas,
    Template
}