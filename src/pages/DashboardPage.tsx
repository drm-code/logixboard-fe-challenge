import {
	makeStyles,
	Grid,
	Container,
	Paper,
	Typography,
	useTheme,
	Box,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Dialog,
	DialogTitle
} from "@material-ui/core"
import React, { ReactElement, useState } from "react"
import { useShipments } from "../data/use-shipments"
import Loader from 'react-loader-spinner'
import { Shipment } from "../data/Shipment"
import moment from 'moment'
import { ExpandMore } from '@material-ui/icons'
import {
	DataGrid,
	GridColDef,
	GridCellParams
} from "@material-ui/data-grid"

const useStyles = makeStyles({
	root: {
		flexGrow: 1
	},
	paper: {
		padding: 20,
		textAlign: 'center',
		color: '#fff',
		'&.arrived': {
			backgroundColor: 'rgb(76, 175, 80)'
		},
		'&.in-transit': {
			backgroundColor: 'rgb(255, 152, 0)'
		},
		'&.customs-hold': {
			backgroundColor: 'rgb(33, 150, 243)'
		},
		'&.cancelled': {
			backgroundColor: 'rgb(220, 0, 78)'
		},
	},
	loader: {
		margin: 'auto',
		width: 'fit-content',
		marginTop: 200
	},
	box: {
		marginTop: 30,
		'&.next-week': {
			marginTop: 50
		}
	},
	nextWeekLabel: {
		marginBottom: 15
	},
	dialog: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 20
	}
})

interface ShipmentsProps {
	data: Shipment[]
}

const Dashboard: React.FC<ShipmentsProps> = ({ data }) => {
	const classes = useStyles()
	const [expanded, setExpanded] = useState<string | false>(false)
	const [dialog, setDialog] = useState(false)
	const [row, setRow] = useState<Shipment | null>(null)

	const arrived = data.filter(item => item.status === 'ARRIVED').length
	const inTransit = data.filter(item => item.status === 'IN_TRANSIT').length
	const customsHold = data.filter(item => item.status === 'CUSTOMS_HOLD').length
	const cancelled = data.filter(item => item.status === 'CANCELLED').length

	const nextWeekStart = moment().add(1, 'weeks').startOf('isoWeek').format('M/D/YY')
	let nextWeekDays: string[] = []
	for (let i=0; i<=6; i++) {
		nextWeekDays.push(moment(nextWeekStart).add(i, 'days').format('MM/DD/YY'))
	}
	const nextWeek = {
		monday: data.filter(item => item.estimatedArrival === nextWeekDays[0]),
		tuesday: data.filter(item => item.estimatedArrival === nextWeekDays[1]),
		wednesday: data.filter(item => item.estimatedArrival === nextWeekDays[2]),
		thursday: data.filter(item => item.estimatedArrival === nextWeekDays[3]),
		friday: data.filter(item => item.estimatedArrival === nextWeekDays[4]),
		saturday: data.filter(item => item.estimatedArrival === nextWeekDays[5]),
		sunday: data.filter(item => item.estimatedArrival === nextWeekDays[6])
	}

	const COLUMNS: GridColDef[] = [
		{
			field: 'houseBillNumber',
			headerName: 'House Bill',
			width: 150
		},
		{
			field: 'client',
			headerName: 'Client',
			width: 400
		},
		{
			field: 'mode',
			headerName: 'Mode',
			width: 200
		},
		{
			field: 'status',
			headerName: 'Status',
			width: 200
		}
	]
	const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  }

	const onCellClick = (params: GridCellParams) => {
		setRow(params.row as Shipment)
		setDialog(true)
	}

	return <Container maxWidth={false}>
		<Box className={classes.box}>
			<div className={classes.root}>
				<Grid
					container
					spacing={6}
				>
					<Grid
						item
						xs={3}
					>
						<Paper
							className={classes.paper + ' arrived'}
							elevation={4}>
							<Typography variant="h4">Arrived</Typography>
							<Typography variant="h2">{arrived}</Typography>
						</Paper>
					</Grid>
					<Grid
						item
						xs={3}
					>
						<Paper
							className={classes.paper + ' in-transit'}
							elevation={4}>
							<Typography variant="h4">In Transit</Typography>
							<Typography variant="h2">{inTransit}</Typography>
						</Paper>
					</Grid>
					<Grid
						item
						xs={3}
					>
						<Paper
							className={classes.paper + ' customs-hold'}
							elevation={4}>
							<Typography variant="h4">Customs Hold</Typography>
							<Typography variant="h2">{customsHold}</Typography>

						</Paper>
					</Grid>
					<Grid
						item
						xs={3}
					>
						<Paper
							className={classes.paper + ' cancelled'}
							elevation={4}>
							<Typography variant="h4">Cancelled</Typography>
							<Typography variant="h2">{cancelled}</Typography>
						</Paper>
					</Grid>
				</Grid>
			</div>
		</Box>
		<Box className={classes.box + ' next-week'}>
			<Typography
				variant="h6"
				className={classes.nextWeekLabel}
			>
				Next Week Shipments
			</Typography>
			<div className={classes.root}>
				<Accordion
					expanded={expanded === 'monday'}
					onChange={handleChange('monday')}
				>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>Monday - {nextWeekDays[0]} ({nextWeek.monday.length} Shipments)</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<DataGrid
							rows={nextWeek.monday}
							columns={COLUMNS}
							onCellClick={onCellClick}
							autoHeight
							hideFooter
						/>
					</AccordionDetails>
				</Accordion>
				<Accordion
					expanded={expanded === 'tuesday'}
					onChange={handleChange('tuesday')}
				>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>Tuesday - {nextWeekDays[1]} ({nextWeek.tuesday.length} Shipments)</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<DataGrid
							rows={nextWeek.tuesday}
							columns={COLUMNS}
							onCellClick={onCellClick}
							autoHeight
							hideFooter
						/>
					</AccordionDetails>
				</Accordion>
				<Accordion
					expanded={expanded === 'wednesday'}
					onChange={handleChange('wednesday')}
				>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>Wednesday - {nextWeekDays[2]} ({nextWeek.wednesday.length} Shipments)</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<DataGrid
							rows={nextWeek.wednesday}
							columns={COLUMNS}
							onCellClick={onCellClick}
							autoHeight
							hideFooter
						/>
					</AccordionDetails>
				</Accordion>
				<Accordion
					expanded={expanded === 'thursday'}
					onChange={handleChange('thursday')}
				>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>Thursday - {nextWeekDays[3]} ({nextWeek.thursday.length} Shipments)</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<DataGrid
							rows={nextWeek.thursday}
							columns={COLUMNS}
							onCellClick={onCellClick}
							autoHeight
							hideFooter
						/>
					</AccordionDetails>
				</Accordion>
				<Accordion
					expanded={expanded === 'friday'}
					onChange={handleChange('friday')}
				>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>Friday - {nextWeekDays[4]} ({nextWeek.friday.length} Shipments)</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<DataGrid
							rows={nextWeek.friday}
							columns={COLUMNS}
							onCellClick={onCellClick}
							autoHeight
							hideFooter
						/>
					</AccordionDetails>
				</Accordion>
				<Accordion
					expanded={expanded === 'saturday'}
					onChange={handleChange('saturday')}
				>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>Saturday - {nextWeekDays[5]} ({nextWeek.saturday.length} Shipments)</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<DataGrid
							rows={nextWeek.saturday}
							columns={COLUMNS}
							onCellClick={onCellClick}
							autoHeight
							hideFooter
						/>
					</AccordionDetails>
				</Accordion>
				<Accordion
					expanded={expanded === 'sunday'}
					onChange={handleChange('sunday')}
				>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>Sunday - {nextWeekDays[6]} ({nextWeek.sunday.length} Shipments)</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<DataGrid
							rows={nextWeek.sunday}
							columns={COLUMNS}
							onCellClick={onCellClick}
							autoHeight
							hideFooter
						/>
					</AccordionDetails>
				</Accordion>
			</div>	
		</Box>
		<Dialog
			open={dialog}
			onClose={() => setDialog(false)}
		>
			<DialogTitle>Shipment Details</DialogTitle>
			<div className={classes.dialog}>
				{row ? (
					<>
						<Typography
							variant="h5"
							color="primary"
						>
							House Bill Number: {row.houseBillNumber}
						</Typography>
						<Typography variant="body1">Client: {row.client}</Typography>
						<Typography variant="body1">Origin: {row.origin}</Typography>
						<Typography variant="body1">Destination: {row.destination}</Typography>
						<Typography variant="body1">Mode: {row.mode}</Typography>
						<Typography variant="body1">Estimated Departure: {row.estimatedDeparture}</Typography>
						<Typography
							variant="body1"
							color="secondary"
						>
							Estimated Arrival: {row.estimatedArrival}
						</Typography>
						<Typography
							variant="body1"
							color="secondary"
						>
							Status: {row.status}
						</Typography>
					</>
				) : null}
			</div>
		</Dialog>
	</Container>
}

export const DashboardPage: React.FC = () => {
		const classes = useStyles()
		const useShipmentsResult = useShipments()
		const theme = useTheme()

		let component: ReactElement
		switch (useShipmentsResult.status) {
			case 'SUCCESS':
				component = <Dashboard data={useShipmentsResult.shipments} />
				break

			case 'LOADING': 
				component =	<Box className={classes.loader}>
					<Loader type="Grid" color={theme.palette.primary.main} />
				</Box >
				break

			case 'ERROR':
				component = <p>Error</p>
		}

    return component
}