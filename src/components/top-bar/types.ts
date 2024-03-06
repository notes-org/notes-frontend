
export type TopBarProps = {
    defaultValue: string | null | undefined;
    onChange: (newValue: string) => void;
    onSubmit: (newValue: string) => void;
    rightContent?: React.ReactNode;
}