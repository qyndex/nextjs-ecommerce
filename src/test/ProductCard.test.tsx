import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/ProductCard";

// next/image and next/link need minimal stubs in a jsdom environment.
vi.mock("next/image", () => ({
  default: ({ alt, ...rest }: { alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

import React from "react";

const baseProduct = {
  id: "1",
  name: "Classic T-Shirt",
  price: 29.99,
  image: "/images/tshirt.jpg",
  category: "Apparel",
};

describe("ProductCard", () => {
  it("renders the product name", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("Classic T-Shirt")).toBeInTheDocument();
  });

  it("renders the product price formatted to 2 decimal places", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("renders the product category", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("Apparel")).toBeInTheDocument();
  });

  it("links to the product detail page", () => {
    render(<ProductCard product={baseProduct} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/1");
  });

  it("renders the product image with correct alt text", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByAltText("Classic T-Shirt")).toBeInTheDocument();
  });

  it("renders a 'View Details' button", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByRole("button", { name: /view details/i })).toBeInTheDocument();
  });

  it("displays whole-dollar prices correctly", () => {
    render(<ProductCard product={{ ...baseProduct, price: 50 }} />);
    expect(screen.getByText("$50.00")).toBeInTheDocument();
  });
});
