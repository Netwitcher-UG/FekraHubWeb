import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMails } from 'src/store/apps/email'
import MessagesDataGrid from 'src/views/messages/dataGrid'
import PayrollDataGrid from 'src/views/payroll/dataGrid'

export default function Index() {

  const {messages} = useSelector(state => state.email)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchMails())
  }, [dispatch])


  return (
    <MessagesDataGrid
      rows={messages}
    />
  )
}
