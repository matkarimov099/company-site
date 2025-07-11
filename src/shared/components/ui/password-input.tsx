import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input, type InputProps } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => {
		const [showPassword, setShowPassword] = useState(false);
		const disabled =
			props.value === '' || props.value === undefined || props.disabled;

		return (
			<div className="relative">
				<Input
					type={showPassword ? 'text' : 'password'}
					className={cn('hide-password-toggle pr-10', className)}
					ref={ref}
					{...props}
				/>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
					onClick={() => setShowPassword((prev) => !prev)}
					disabled={disabled}
				>
					{showPassword && !disabled ? (
						<EyeIcon
							className="h-4 w-4 dark:text-gray-400"
							aria-hidden="true"
						/>
					) : (
						<EyeOffIcon
							className="h-4 w-4 dark:text-gray-400"
							aria-hidden="true"
						/>
					)}
					<span className="sr-only">
						{showPassword ? 'Hide password' : 'Show password'}
					</span>
				</Button>

				{/* hides browser password toggles */}
				<style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
			</div>
		);
	},
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
