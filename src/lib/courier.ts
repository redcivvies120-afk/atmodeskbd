// src/lib/courier.ts
import { normalizeBDPhone } from '@/lib/utils'

export interface CreateCourierOrderOptions {
  orderNumber: string
  recipientName: string
  recipientPhone: string
  recipientAddress: string
  recipientCity?: string
  codAmount: number
  note?: string
  itemDescription?: string
}

export interface CourierOrderResult {
  success: boolean
  courier: 'steadfast' | 'pathao'
  consignmentId?: string | number
  trackingCode: string
  trackingUrl: string
  status?: string
  error?: string
  simulated?: boolean
}

/**
 * 1-Click Steadfast Courier Dispatch
 */
export async function sendToSteadfast(
  opts: CreateCourierOrderOptions
): Promise<CourierOrderResult> {
  const apiKey = process.env.STEADFAST_API_KEY
  const secretKey = process.env.STEADFAST_SECRET_KEY

  const phone = normalizeBDPhone(opts.recipientPhone)

  // Simulation mode if keys are not set yet
  if (!apiKey || !secretKey) {
    const fakeId = Math.floor(1000000 + Math.random() * 9000000)
    const trackingCode = `STDF-${fakeId}`
    console.log('🚚 [Steadfast Simulated Dispatch]', {
      invoice: opts.orderNumber,
      name: opts.recipientName,
      phone,
      cod: opts.codAmount,
    })

    return {
      success: true,
      courier: 'steadfast',
      consignmentId: fakeId,
      trackingCode,
      trackingUrl: `https://steadfast.com.bd/tracking/${trackingCode}`,
      status: 'simulated_created',
      simulated: true,
    }
  }

  try {
    const response = await fetch('https://portal.steadfast.com.bd/api/v1/create_order', {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'Secret-Key': secretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoice: opts.orderNumber,
        recipient_name: opts.recipientName,
        recipient_phone: phone,
        recipient_address: opts.recipientAddress,
        cod_amount: opts.codAmount,
        note: opts.note || 'ATMODESK Smart Desk Gadget - Fragile electronics',
      }),
    })

    const data = await response.json()

    if (data?.status === 200 && data?.consignment) {
      const trackingCode = data.consignment.tracking_code || String(data.consignment.consignment_id)
      return {
        success: true,
        courier: 'steadfast',
        consignmentId: data.consignment.consignment_id,
        trackingCode,
        trackingUrl: `https://steadfast.com.bd/tracking/${trackingCode}`,
        status: data.consignment.status || 'in_review',
      }
    }

    return {
      success: false,
      courier: 'steadfast',
      trackingCode: '',
      trackingUrl: '',
      error: data?.message || data?.errors ? JSON.stringify(data.errors) : 'Failed to create Steadfast order',
    }
  } catch (error: any) {
    console.error('[Steadfast API Error]:', error)
    return {
      success: false,
      courier: 'steadfast',
      trackingCode: '',
      trackingUrl: '',
      error: error?.message || 'Steadfast connection error',
    }
  }
}

/**
 * 1-Click Pathao Courier Dispatch
 */
export async function sendToPathao(
  opts: CreateCourierOrderOptions
): Promise<CourierOrderResult> {
  const clientId = process.env.PATHAO_CLIENT_ID
  const clientSecret = process.env.PATHAO_CLIENT_SECRET
  const username = process.env.PATHAO_USERNAME
  const password = process.env.PATHAO_PASSWORD
  const storeId = process.env.PATHAO_STORE_ID

  const phone = normalizeBDPhone(opts.recipientPhone)

  // Simulation mode if keys are not set yet
  if (!clientId || !clientSecret || !username || !password) {
    const fakeId = `PTH-${Math.floor(1000000 + Math.random() * 9000000)}`
    console.log('🚚 [Pathao Simulated Dispatch]', {
      invoice: opts.orderNumber,
      name: opts.recipientName,
      phone,
      cod: opts.codAmount,
    })

    return {
      success: true,
      courier: 'pathao',
      consignmentId: fakeId,
      trackingCode: fakeId,
      trackingUrl: `https://merchant.pathao.com/tracking?consignment_id=${fakeId}`,
      status: 'simulated_created',
      simulated: true,
    }
  }

  try {
    // 1. Issue access token
    const tokenRes = await fetch('https://courier.pathao.com/aladdin/api/v1/issue-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        username,
        password,
        grant_type: 'password',
      }),
    })

    const tokenData = await tokenRes.json()
    const accessToken = tokenData?.access_token

    if (!accessToken) {
      return {
        success: false,
        courier: 'pathao',
        trackingCode: '',
        trackingUrl: '',
        error: tokenData?.message || 'Could not authenticate with Pathao',
      }
    }

    // 2. Create order
    const orderRes = await fetch('https://courier.pathao.com/aladdin/api/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        store_id: Number(storeId) || 1,
        merchant_order_id: opts.orderNumber,
        recipient_name: opts.recipientName,
        recipient_phone: phone,
        recipient_address: opts.recipientAddress,
        recipient_city: 1, // Dhaka default
        recipient_zone: 1,
        delivery_type: 48, // Standard delivery
        item_type: 2, // Parcel
        special_instruction: opts.note || 'Fragile electronics',
        item_quantity: 1,
        item_weight: 0.5,
        amount_to_collect: opts.codAmount,
        item_description: opts.itemDescription || 'ATMODESK Smart Desk Tech',
      }),
    })

    const orderData = await orderRes.json()

    if (orderData?.data?.consignment_id) {
      const consignmentId = orderData.data.consignment_id
      const trackingCode = orderData.data.tracking_code || consignmentId
      return {
        success: true,
        courier: 'pathao',
        consignmentId,
        trackingCode,
        trackingUrl: `https://merchant.pathao.com/tracking?consignment_id=${consignmentId}`,
        status: 'created',
      }
    }

    return {
      success: false,
      courier: 'pathao',
      trackingCode: '',
      trackingUrl: '',
      error: orderData?.message || JSON.stringify(orderData?.errors || 'Failed to create Pathao order'),
    }
  } catch (error: any) {
    console.error('[Pathao API Error]:', error)
    return {
      success: false,
      courier: 'pathao',
      trackingCode: '',
      trackingUrl: '',
      error: error?.message || 'Pathao connection error',
    }
  }
}
