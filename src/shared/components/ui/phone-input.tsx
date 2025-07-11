import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

import { Button } from '@/shared/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/shared/components/ui/command';
import { Input, type InputProps } from '@/shared/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/shared/components/ui/popover';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { cn } from '@/shared/lib/utils';

type PhoneInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'onChange' | 'value'
> &
	Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
		onChange?: (value: RPNInput.Value) => void;
		inputSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | string;
		inputClassName?: string; // yangi prop qo'shildi
	};

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
	React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
		({ className, inputClassName, onChange, ...props }, ref) => {
			return (
				<RPNInput.default
					ref={ref}
					className={cn('flex', className)}
					flagComponent={FlagComponent}
					countrySelectComponent={CountrySelect}
					inputComponent={InputComponent}
					smartCaret={false}
					/**
					 * Handles the onChange event.
					 *
					 * react-phone-number-input might trigger the onChange event as undefined
					 * when a valid phone number is not entered. To prevent this,
					 * the value is coerced to an empty string.
					 *
					 * @param {E164Number | undefined} value - The entered value
					 */
					onChange={(value) => {
						if (value) onChange?.(value);
					}}
					inputClassName={inputClassName}
					{...props}
				/>
			);
		},
	);
PhoneInput.displayName = 'PhoneInput';

const InputComponent = React.forwardRef<
	HTMLInputElement,
	InputProps & { inputClassName?: string }
>(({ className, inputClassName, ...props }, ref) => (
	<Input
		className={cn('rounded-md', inputClassName, className)}
		{...props}
		ref={ref}
	/>
));
InputComponent.displayName = 'InputComponent';

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
	disabled?: boolean;
	value: RPNInput.Country;
	onChange: (value: RPNInput.Country) => void;
	options: CountrySelectOption[];
};

const CountrySelect = ({
	disabled,
	value,
	onChange,
	options,
}: CountrySelectProps) => {
	const handleSelect = React.useCallback(
		(country: RPNInput.Country) => {
			onChange(country);
		},
		[onChange],
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant={'outline'}
					className="hidden gap-1 rounded rounded-s-lg border-r-0 px-3 focus:z-10"
					disabled={disabled}
				>
					<FlagComponent country={value} countryName={value} />
					<ChevronsUpDown
						className={cn(
							'-mr-2 h-4 w-4 opacity-50',
							disabled ? 'hidden' : 'opacity-100',
						)}
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0">
				<Command>
					<CommandInput placeholder="Search country..." />
					<CommandList>
						<ScrollArea className="h-72">
							<CommandEmpty>No country found.</CommandEmpty>
							<CommandGroup>
								{options
									.filter((x) => x.value)
									.map((option) => (
										<CommandItem
											className="gap-2"
											key={option.value}
											onSelect={() => handleSelect(option.value)}
										>
											<FlagComponent
												country={option.value}
												countryName={option.label}
											/>
											<span className="flex-1 text-sm">{option.label}</span>
											{option.value && (
												<span className="text-sm text-foreground/50">
													{`+${RPNInput.getCountryCallingCode(option.value)}`}
												</span>
											)}
											<CheckIcon
												className={cn(
													'ml-auto h-4 w-4',
													option.value === value ? 'opacity-100' : 'opacity-0',
												)}
											/>
										</CommandItem>
									))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
	const Flag = flags[country];

	return (
		<span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg]:size-full">
			{Flag && <Flag title={countryName} />}
		</span>
	);
};
FlagComponent.displayName = 'FlagComponent';

export { PhoneInput };
