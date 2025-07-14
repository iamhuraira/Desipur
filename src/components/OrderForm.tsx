"use client"

import React from 'react';
import { Form, Input, InputNumber, Button, Typography, Row, Col, Checkbox, message } from 'antd';
import {CopyOutlined, PlusOutlined, MinusOutlined, SaveOutlined} from '@ant-design/icons';
import useState from 'react-usestateref'

const { TextArea } = Input;
const { Title } = Typography;

interface Product {
    id: string;
    name: string;
    price: number;
}

const products: Product[] = [
    { id: '1', name: 'Forest Honey 400g', price: 2700 },
    { id: '2', name: 'Harbel Shampoo 50ml', price: 200 },
    { id: '3', name: 'Harbel Shampoo 200ml', price: 750 },
];

export default function OrderForm() {
    const [form] = Form.useForm();
    const [selectedProducts, setSelectedProducts, selectedProductsRef] = useState<string[]>([]);
    const [productQuantities, setProductQuantities, productQuantitiesRef] = useState<Record<string, number>>({});
    const [_, setOutput, outputRef] = useState<string>('');

    const handleProductChange = (checkedValues: string[]) => {
        setSelectedProducts(checkedValues);
        const updatedQuantities = { ...productQuantitiesRef.current };
        checkedValues.forEach((id) => {
            if (!updatedQuantities[id]) {
                updatedQuantities[id] = 1;
            }
        });
        setProductQuantities(updatedQuantities);
        handleFormChange();
    };

    const handleQuantityAdjust = (id: string, type: 'inc' | 'dec') => {
        const currentQty = productQuantitiesRef.current[id] || 1;
        const newQty = type === 'inc' ? currentQty + 1 : Math.max(currentQty - 1, 1);
        setProductQuantities({ ...productQuantitiesRef.current, [id]: newQty });
        handleFormChange();
    };

    const handleFormChange = () => {
        const values = form.getFieldsValue();
        const { customerName, customerPhone, customerAddress, shippingFee = 0 } = values;

        const selectedItems = products.filter((p) => selectedProductsRef.current.includes(p.id));
        const productList = selectedItems
            .map(p => `${p.name} x${productQuantitiesRef.current[p.id] || 1}`)
            .join(', ');

        const productTotal = selectedItems.reduce((acc, curr) => {
            const qty = productQuantitiesRef.current[curr.id] || 1;
            return acc + curr.price * qty;
        }, 0);

        const totalBill = productTotal + shippingFee;

        const messageText =
            `🐝 *Order Confirmation*\n\n` +
            `👤 *Customer:* ${customerName || ''}\n` +
            `📞 *Phone #:* ${customerPhone || ''}\n` +
            `🏠 *Address:* ${customerAddress || ''}\n\n` +
            `🛍 *Order List:* ${productList}\n` +
            `💰 *Product Total:* Rs. ${productTotal}\n` +
            `🚚 *Shipping Fee:* Rs. ${shippingFee}\n` +
            `🧾 *Total Bill:* Rs. ${totalBill}\n\n` +
            `💳 *Payment Option:*\n1. Easypaisa/JazzCash\n📱 0308-6173323 – Abu Huraira\n\n` +
            `📩 Kindly send the payment screenshot after transfer.\n` +
            `✏️ If you want to update anything in your order, just reply to this message.\n\n` +
            `🙏 Thank you for choosing *DesiPur!* 🍯\n💛 Stay healthy, stay sweet! 😊`;

        setOutput(messageText);
    };

    const handleSaveToSheet = async () => {
        const values = form.getFieldsValue();
        const selectedItems = products.filter(p => selectedProductsRef.current.includes(p.id));
        const productList = selectedItems.map(p => `${p.name} x${productQuantitiesRef.current[p.id] || 1}`).join(', ');
        const productTotal = selectedItems.reduce((acc, curr) => acc + curr.price * (productQuantitiesRef.current[curr.id] || 1), 0);
        const totalBill = productTotal + (values.shippingFee || 0);

        const payload = {
            date: new Date().toLocaleString(),
            id: Date.now(),
            customerName: values.customerName,
            phone: values.customerPhone,
            address: values.customerAddress,
            productName: productList,
            totalPrice: productTotal,
            deliveryFee: values.shippingFee,
            totalBill: totalBill,
            paid: '',
            trackingCompany: '',
            trackingNumber: '',
            delivered: '',
            rating: '',
            testimonial: ''
        };

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbyFQU60YHIlIbPqeepAfKN1AYyalW7lAWQrqJRYWt1-9SN8jte14UkwND8vq8BJPLS1/exec', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response);
            message.success('Order saved to Google Sheet ✅');
        } catch (error) {
            message.error('Failed to save order to Google Sheet ❌');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(outputRef.current);
            message.success('Copied to clipboard!');
        } catch {
            message.error('Failed to copy!');
        }
    };

    return (
        <Row gutter={24} style={{ padding: 24 }} wrap>
            <Col span={24} lg={12}>
                <Title level={4}>Order Form</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={handleFormChange}
                >
                    <Form.Item name="customerName" label="Customer Name">
                        <Input placeholder="Enter full name" />
                    </Form.Item>
                    <Form.Item name="customerPhone" label="Customer Phone Number">
                        <Input placeholder="0300xxxxxxx" />
                    </Form.Item>
                    <Form.Item name="customerAddress" label="Customer Address">
                        <TextArea rows={2} placeholder="Enter delivery address" />
                    </Form.Item>

                    <Form.Item label="Products">
                        <Checkbox.Group style={{ width: '100%' }} onChange={handleProductChange}>
                            <Row gutter={[8, 8]}>
                                {products.map(product => (
                                    <Col span={24} key={product.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', border: '1px solid #f0f0f0', borderRadius: 8 , height: "60px" }}>
                                        <Checkbox value={product.id} style={{ flex: 1 }}>
                                            {product.name} – Rs. {product.price}
                                        </Checkbox>
                                        {selectedProducts.includes(product.id) && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Button icon={<MinusOutlined />} onClick={() => handleQuantityAdjust(product.id, 'dec')} />
                                                <InputNumber
                                                    min={1}
                                                    value={productQuantities[product.id] || 1}
                                                    readOnly
                                                    style={{ width: 60 }}
                                                />
                                                <Button icon={<PlusOutlined />} onClick={() => handleQuantityAdjust(product.id, 'inc')} />
                                            </div>
                                        )}
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item name="shippingFee" label="Shipping Fee" initialValue={250}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
                <Button icon={<SaveOutlined />} onClick={handleSaveToSheet} style={{ marginTop: 12 }}>
                    Save to Google Sheet
                </Button>
            </Col>
            <Col span={24} lg={12}>
                <Title level={4}>Generated Message</Title>
                <TextArea value={outputRef.current} rows={20} readOnly style={{ whiteSpace: 'pre-wrap' }} />
                <Button type="primary" icon={<CopyOutlined />} onClick={handleCopy} style={{ marginTop: 12 }}>
                    Copy to Clipboard
                </Button>
            </Col>
        </Row>
    );
}