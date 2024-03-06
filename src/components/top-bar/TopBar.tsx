import Container from "@mui/material/Container";
import { TopBarProps } from "./types";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import { Divider, InputBase } from "@mui/material";
import { useState } from "react";

/*
 * State less top bar including an url input.
 * Additional elements can be added on the right side via rightContent property.
 */
function TopBar({ defaultValue, onChange, onSubmit, rightContent }: TopBarProps) {

	/** Input field */
	const [value, setValue] = useState(defaultValue)

	function handleChange(event: any): void {
		const newValue = event.target.value;
		setValue(newValue)
		onChange(newValue)
	}

	function handleSubmit(event: any): void {
		const newValue = event.currentTarget[0].value
		event.preventDefault();
		onSubmit(newValue)
	}

	return (<>
		<Container
			maxWidth={false}
			className="w-100 shadow-md shadow-blue-300/10 py-2"
		>
			<Box
				component="div"
				className="flex items-middle gap-5"
			>
				<h1 className="flex-none font-extralight text-3xl">Notes</h1>
				<Divider orientation="vertical" flexItem>
				</Divider>
				<Box
					component="form"
					className="ps-2 gap-2 flex flex-1 items-center rounded-md bg-slate-100"
					onSubmit={handleSubmit}
				>
					<InputLabel className="flex-none">Current source </InputLabel>
					<InputBase
						name="input"
						className="flex-1 px-2 rounded bg-white border-2 border-slate-100"
						placeholder="Paste an url ..."
						value={value}
						onChange={handleChange}
					/>
				</Box>
				<Box className="flex items-end">
					{rightContent}
				</Box>				
			</Box >
			
		</Container>		
	</>)
}

export default TopBar;