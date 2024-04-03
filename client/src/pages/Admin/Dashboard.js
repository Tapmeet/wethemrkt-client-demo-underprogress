import React, { Component } from 'react';
import { Row, Col } from "reactstrap"
import CardUser from "./carduser"
import CardSymbol from "./cardsymbol"
export const AdminDashboard =  () => (
    <>
        <Row>
            <Col md={6}>
                <CardUser />
            </Col>
            <Col md={6}>
                <CardSymbol />
            </Col>
        </Row>
    </>
)