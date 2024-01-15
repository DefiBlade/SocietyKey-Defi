import clsx from 'clsx';
import * as React from 'react';
import BaseButton from '@material-ui/core/Button';
import BeatLoader from 'react-spinners/BeatLoader';

import './button.scss';

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  customClass: any;
  secondary?: boolean;
  loading?: boolean;
  onClick: () => void;
  fullWidth?: boolean;
}

const Button = ({
  children,
  disabled,
  customClass,
  secondary,
  loading,
  onClick,
  fullWidth,
}: ButtonProps) => {
  const classes = clsx(
    'button',
    { disabled: disabled },
    { secondary: secondary },
    customClass
  );

  return (
    <BaseButton className={classes} onClick={onClick} fullWidth={fullWidth}>
      {loading ? <BeatLoader color='#fff' loading={true} size={8} /> : children}
    </BaseButton>
  );
};

export default Button;
