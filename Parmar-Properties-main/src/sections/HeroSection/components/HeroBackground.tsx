interface HeroBackgroundProps {
  rootVariant?: string;
  firstLayerVariant?: string;
  firstImageSrc?: string;
  firstImageClassName?: string;
  firstImageSizes?: string;
  showSecondLayer?: boolean;
  secondLayerVariant?: string;
  secondImageSrc?: string;
  secondImageClassName?: string;
  secondImageSizes?: string;
  showCenterImages?: boolean;
  centerImageSrc?: string;
  centerImageClassName?: string;
  centerImageSizes?: string;
  showBottomImage?: boolean;
  bottomImageSrc?: string;
  bottomImageClassName?: string;
  bottomImageSizes?: string;
}

export const HeroBackground = ({
  rootVariant = "",
  firstLayerVariant = "",
  firstImageSrc = "",
  firstImageClassName = "",
  showSecondLayer = false,
  secondLayerVariant = "",
  secondImageSrc = "",
  secondImageClassName = "",
  showCenterImages = false,
  centerImageSrc = "",
  centerImageClassName = "",
  showBottomImage = false,
  bottomImageSrc = "",
  bottomImageClassName = "",
}: HeroBackgroundProps) => {
  return (
    <div className={`absolute inset-0 ${rootVariant}`}>
      <div className={`absolute inset-0 bg-neutral-900 ${firstLayerVariant}`}>
        {firstImageSrc && (
          <img
            src={firstImageSrc}
            className={firstImageClassName}
            alt="Background"
          />
        )}
      </div>
      {showSecondLayer && (
        <div className={`absolute ${secondLayerVariant}`}>
          {secondImageSrc && (
            <img
              src={secondImageSrc}
              className={secondImageClassName}
              alt="Layer"
            />
          )}
        </div>
      )}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.2),_transparent_60%)]"></div>
    </div>
  );
};
