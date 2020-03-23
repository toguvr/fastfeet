import React, { useState, useEffect } from 'react';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Table from '~/components/Table';
import Avatar from '~/components/Avatar';
import Status from '~/components/Status';
import Action from '~/components/Action';
import { Container, Search } from './styles';
import { DivFlex } from '~/styles';
import { filterResult } from '~/services/filter';
import { routes } from '~/routes';
import { addRecipient } from '~/services/recipient';
import { toast } from 'react-toastify';
import { addOrder } from '~/services/order';

export default function SignUpOrder() {
  const history = useHistory();

  const [data, setData] = useState([])
  const [values, setValues] = useState({
    deliveryman_id:'',
    recipient_id: '',
    product: ''
  });

  useEffect(()=>{
    async function getOrder() {
      const response = await filterResult('recipientFilter', '');

      setData(response.data);
      setValues({...values,
        deliveryman_id: response.data.deliverymen[0].id,
        recipient_id: response.data.recipient[0].id
      })
    }
    getOrder()
  },[])

  async function createOrder() {
    try{
    await addOrder(values);
    setValues({
      deliveryman_id:'',
      recipient_id: '',
      product: ''
    });
    toast.success('Cadastrado com sucesso')
    }catch{
      toast.error('Não foi possível cadastrar')
    }
  }

  return (
    <>
      <Container>
        <header>
          <strong>Cadastro de encomendas</strong>
          <div className="div">
            <button
              className="back"
              onClick={() => history.push(routes.orders)}
            >
              <MdKeyboardArrowLeft color="#fff" size={18} />
              Voltar
            </button>
            <button onClick={createOrder}>
              <MdDone color="#fff" size={18} />
              Salvar
            </button>
          </div>
        </header>
        <form>
          <div className="group">
            <label htmlFor="recipient_id">
              Destinatário
              <select
                onChange={event =>
                  setValues({
                    ...values,
                    [event.target.name]: event.target.value,
                  })
                }
                value={values.recipient_id}
                name="recipient_id"
                type="text"
              >
                {data.recipient && data.recipient.map((recipient)=>(
                  <option value={recipient.id}>{recipient.name}</option>

                ))}
              </select>
            </label>
            <label htmlFor="deliveryman_id">
              Entregador
              <select
                onChange={event =>
                  setValues({
                    ...values,
                    [event.target.name]: event.target.value,
                  })
                }
                value={values.deliveryman_id}
                name="deliveryman_id"
                type="text"
              >
                        {data.deliverymen && data.deliverymen.map((recipient)=>(
                  <option value={recipient.id}>{recipient.name}</option>

                ))}
              </select>
            </label>
          </div>

            <label htmlFor="product">
              Produto
              <input
                onChange={event =>
                  setValues({
                    ...values,
                    [event.target.name]: event.target.value,
                  })
                }
                value={values.product}
                name="product"
                type="text"
              />
            </label>

        </form>
      </Container>
    </>
  );
}
