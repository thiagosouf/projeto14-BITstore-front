import { useEffect, useContext } from "react";
import { Link } from "react-router-dom"
import axios from "axios";
import { useState } from "react";
import styled from "styled-components"

import UserContext from '../../contexts/UserContext';

export default function CheckOut() {
    const { user } = useContext(UserContext);
    const { address, setAddress } = useContext(UserContext);
    const [cart, setCart] = useState([]);
    const [email, setEmail] = useState('');
    const [total, setTotal] = useState(0);
    const [cupom, setCupom] = useState('');
    const [cupomValue, setCupomValue] = useState(true);


    const tkn = (localStorage.getItem('token'));
    console.log(tkn)

    useEffect(() => {
        console.log("user do context =");
        console.log(user)
        if (user) {
            const requisicao = axios.get('http://localhost:5000/signin', {
                headers: {
                    Authorization: `${user.token}`
                }
            });
            requisicao.then(res => {
                console.log(res.data);
                setEmail((res.data.email));
            }
            ).catch(err => {
                console.log(err);
            }
            )
        }
    }, [user]);

    useEffect(() => {

        const requisicao = axios.get('http://localhost:5000/address', {
            headers: {
                Authorization: `${user.token}`
            }
        });
        requisicao.then(res => {
            console.log(res.data);
            setAddress((res.data));
        }
        ).catch(err => {
            console.log(err);
        }
        )
    }, []);

    // ****Requisição para pegar o carrinho do usuário****
    // useEffect(() => {
    //     const requisicao = axios.get('http://localhost:5000/cart', {
    //         headers: {
    //             Authorization: `${user.token}`
    //             }
    //             });
    //     requisicao.then(res => {
    //         console.log(res.data);
    //         setCart((res.data));
    //     }
    //     ).catch(err => {
    //         console.log(err);
    //     }
    //     )
    // }, []);

    function testarCupom(event) {
        event.preventDefault();
        if (cupomValue === true) {
            if (cupom === 'cupom') {
                setTotal(total - (total * 0.1));
                alert('Cupom de desconto aplicado com sucesso!');
                setCupomValue(false);
            } else {
                alert('Cupom inválido!');
            }
        } else {
            alert('Cupom já aplicado!');
        }
    }


    //carrinho falso
    useEffect(() => {
        setCart([
            {
                id: 1,
                name: "RTX 3090",
                description: "Placa de video",
                price: "35000.00",
                image: "https://a-static.mlcdn.com.br/618x463/placa-de-video-asus-geforce-rtx-3090-24gb-gddr6x-384-bits-rog-strix-gaming/magazineluiza/230472200/65b795e36daa4fd8df679cae018c1c0a.jpg",
                qty: 1
            },
            {
                id: 2,
                name: "Hd 10 TB",
                description: "HD",
                price: "2000.00",
                image: "https://a-static.mlcdn.com.br/618x463/hd-interno-seagate-exos-x16-10tb-nas-sata-6gb-7200rpm-256mb-3-5-512e-4kn-st10000nm001g/gigantec/19017/06b3f6e88e4e2f91a3a1e577efd8a935.jpg",
                qty: 2
            },
            {
                id: 3,
                name: "Memoria Ram",
                description: "Memoria DDR4 16GB",
                price: "400",
                image: "https://a-static.mlcdn.com.br/1500x1500/memoria-kingston-fury-impact-16gb-2666mhz-ddr4-cl15-para-notebook-kf426s15ib1-16/kabum/172295/e4297d8aa0e030de62084530b1dd9022.jpg",
                qty: 2
            }
        ]);
    }, []);

    useEffect(() => {
        let total = 0;
        cart.map(item => {
            total += item.price * item.qty;
        });
        setTotal(total);
    }, [cart]);

    return (
        <TeladeCheckout>
            <Topo>
                {(user) ? <>
                    <h1>Olá, {user.name}!</h1>
                    <h1>Seu email: {email}</h1>
                </>
                    :
                    <Link to="/login"><p>Faça Login ou crie seu Cadastro</p></Link>}
            </Topo>
            <Titulo><p>CHECKOUT</p></Titulo>
            <hr width="50%"></hr>
            {(cart) ?
                <Produtos>
                    <Titulo><p>Produtos</p></Titulo>
                    {cart.map(produto => {
                        return (
                            <Produto>
                                <><img src={produto.image} alt={produto.name} /></>
                                <Descricao>
                                    <h1>{produto.name}</h1>
                                    <h2>{produto.description}</h2>
                                    <h2>R$ {produto.price}</h2>
                                    <h2>Quantidade: {produto.qty}</h2>
                                </Descricao>
                            </Produto>
                        )
                    })}
                </Produtos>
                :
                <p>Não há produtos no carrinho</p>}

            <hr width="50%"></hr>
            <Titulo>Endereço de entrega</Titulo>
            {(address) ?

                (<Entrega>

                    <Info>Cep: <div>{address.cep}</div></Info>
                    <Info>Endereco: <div>{address.endereco}</div></Info>
                    <Info>Numero: <div>{address.numero}</div></Info>
                    <Info>Complemento: <div>{address.complemento}</div></Info>
                    <Info>Bairro: <div>{address.bairro}</div></Info>
                    <Info>Cidade: <div>{address.cidade}</div></Info>
                    <Info>Estado: <div>{address.estado}</div></Info>
                </Entrega>
                )



                : (<Link to="/address"><p>Cadastre seu endereço</p></Link>)}

            {/* <Frete></Frete> */}
            <hr width="50%"></hr>
            <Titulo><p>Cupom de Desconto</p></Titulo>
            <Cupom>

                <CupomInput onSubmit={testarCupom}>
                    <input type="text" placeholder="Digite seu cupom" value={cupom} onChange={(e) => setCupom(e.target.value)} />
                    <button type="submit">Aplicar</button>


                </CupomInput>
            </Cupom>
            <hr width="50%"></hr>
            <Valor>
                <h1>Valor Total: R$ {total}</h1>
                <Link to="/">
                    <button onClick={() => alert('Compra finalizada com sucesso!')}>Finalizar Compra</button>
                </Link>
            </Valor>


        </TeladeCheckout>
    )
}

const TeladeCheckout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    background-color: antiquewhite;
`
const Topo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    margin: 30px;
    padding-right: 30px;
`

const Produtos = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

`
const Produto = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    img{
        width: 100px;
        height: 100px;
        border: 1px solid black;
    }
    h1{
        font-size: 20px;
        font-weight: 700;
    }
    h2{
        font-size: 15px;
        font-weight: 400;
    }
`
const Descricao = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin: 30px

`

const Entrega = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 10px;
    border: 1px solid black;
    font-size: 20px;
    width: 80%;
    p{
        margin: 5px;
    }
    `
const Info = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin: 5px;
    width: 95%;
    height: 30px;    
    div{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        background-color: #dcdcdc;
        border: 1px solid black;
        padding-left: 5px;
        margin: 5px;
        width: 100%;
        height: 30px;
        }
        `


const Titulo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 10px;
    font-size: 20px;
    font-weight: 700;`

// const Frete = styled.div``

const Cupom = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    font-size: 20px;
    width: 100%;
 `
const CupomInput = styled.form`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 5px;
    width: 80%;
    height: 30px;
    input{
        font-size: 20px;
        width: 60%;
    }
    button{
        font-size: 20px;
        width: 30%;
        height: 30px;
    }
`

const Valor = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 10px;
    font-size: 20px;
    font-weight: 700;
    button{
        margin: 30px;
        font-size: 20px;
        width: 100%;
        height: 30px;
        background-color: green;
        font-size: x-large;
        font-weight: 700;
    }
    `