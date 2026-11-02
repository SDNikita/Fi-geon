import IconButton from '../IconButton/IconButton';
import type { IconButtonProps } from '../IconButton/IconButton';
import styles from './MediaButton.module.scss';
type MediaButtonProps = Omit<IconButtonProps, 'children' | 'label'> & {
    isPlaying: boolean;
};
function MediaButton({ isPlaying, variant = 'primary', className = '', ...props }: MediaButtonProps) {
    return (<IconButton {...props} variant={variant} label={isPlaying ? 'Приостановить' : 'Продолжить'} className={[styles.button, className].filter(Boolean).join(" ")}>
            <svg viewBox="0 0 24 24" fill="currentColor">
                {isPlaying ? (<>
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </>) : (<path d="M8 4L20 12L8 20Z"/>)}
            </svg>
        </IconButton>);
}
export default MediaButton;
