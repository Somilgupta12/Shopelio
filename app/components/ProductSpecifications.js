import React from 'react';

const ProductSpecifications = ({ specifications }) => {
  if (!specifications) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="space-y-2">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Brand</span>
            <span>{specifications.brand}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Model</span>
            <span>{specifications.model}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Color</span>
            <span>{specifications.color}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Material</span>
            <span>{specifications.material}</span>
          </div>
        </div>

        {/* Dimensions and Weight */}
        <div className="space-y-2">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Dimensions</span>
            <span>
              {specifications.dimensions?.length} x {specifications.dimensions?.width} x {specifications.dimensions?.height} {specifications.dimensions?.unit}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Weight</span>
            <span>
              {specifications.weight?.value} {specifications.weight?.unit}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Warranty</span>
            <span>
              {specifications.warranty?.duration} {specifications.warranty?.unit}
            </span>
          </div>
        </div>

        {/* Features */}
        {specifications.features && specifications.features.length > 0 && (
          <div className="md:col-span-2">
            <h4 className="font-medium mb-2">Features</h4>
            <ul className="list-disc list-inside space-y-1">
              {specifications.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Compatibility */}
        {specifications.compatibility && specifications.compatibility.length > 0 && (
          <div className="md:col-span-2">
            <h4 className="font-medium mb-2">Compatibility</h4>
            <ul className="list-disc list-inside space-y-1">
              {specifications.compatibility.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional Info */}
        {specifications.additionalInfo && Object.keys(specifications.additionalInfo).length > 0 && (
          <div className="md:col-span-2">
            <h4 className="font-medium mb-2">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(specifications.additionalInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="font-medium">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSpecifications; 