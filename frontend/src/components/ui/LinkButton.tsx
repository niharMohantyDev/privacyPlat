import { Link, type LinkProps } from 'react-router-dom'

import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonStyles'

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

/** Same visual language as Button, for CTAs that navigate rather than submit/act. */
export function LinkButton({ variant = 'primary', size = 'md', className = '', ...rest }: LinkButtonProps) {
  return <Link className={buttonClasses(variant, size, className)} {...rest} />
}
