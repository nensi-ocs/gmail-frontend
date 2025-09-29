import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DataGrid } from '@mui/x-data-grid'
import API from 'src/utils/api'

function Dash() {
  const [isLoading, setIsLoading] = useState(false)
  const [chatData, setChatData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [rowCountState, setRowCountState] = useState(0)

  const fetchChatData = async () => {
    setIsLoading(true)
    try {
      const requestPayload = {
        offset: Number(paginationModel.pageSize),
        page: Number(paginationModel.page * paginationModel.pageSize)
      }
      const response = await API.chatHistory(requestPayload)
      if (response && response?.data) {
        setChatData(response?.data?.list)
        setRowCountState(Number(response?.data?.totalCount))
      }
      setIsLoading(false)
    } catch (error) {
      console.log('Error fething chat data:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchChatData()
  }, [paginationModel])

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      headerName: 'ID',
      renderCell: ({ row }) => <Typography>{row.id}</Typography>
    },
    {
      flex: 0.1,
      field: 'credit',
      textAlign: 'center',
      headerName: 'Credit',
      renderCell: ({ row }) => <Typography>{row.total_bonus_credit_left + row.total_credit_left}</Typography>
    },
    {
      flex: 0.1,
      field: 'created_at',
      headerName: 'Created At',
      renderCell: ({ row }) => <Typography>{new Date(row.created_at).toUTCString()}</Typography>
    }
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              rows={chatData}
              columns={columns}
              pagination
              autoHeight
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode='server'
              rowCount={rowCountState}
              loading={isLoading}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default Dash
