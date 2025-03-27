import dask.dataframe as dd
import os

def process_large_tsv_dask(input_file):
    """
    Uses Dask to process a large TSV file, detecting ASCII vs non-ASCII lines,
    and writes:
    - ASCII lines to `ascii_filename.tsv`
    - Non-ASCII lines to `non_ascii_filename.csv`
    """
    
    # Generate output filenames
    base_name = os.path.basename(input_file)[:-4]
    ascii_file = f"{base_name}_ascii.tsv"
    non_ascii_file = f"{base_name}_non_ascii.csv"

    # Read the TSV file using Dask
    df = dd.read_csv(input_file, sep="\t", dtype=str, encoding="utf-8", assume_missing=True)

    # Function to check if a row contains only ASCII characters
    def is_ascii(row):
        return all(all(ord(char) < 128 for char in str(value)) for value in row)

    # Apply the function
    ascii_rows = df[df.apply(is_ascii, axis=1, meta=df)]
    non_ascii_rows = df[~df.apply(is_ascii, axis=1, meta=df)]

    # Save outputs
    ascii_rows.to_csv(ascii_file, sep="\t", index=False, single_file=True)
    non_ascii_rows.to_csv(non_ascii_file, index=False, single_file=True)

    print(f"Processed '{input_file}'.")
    print(f"ASCII lines saved to: {ascii_file}")
    print(f"Non-ASCII lines saved to: {non_ascii_file}")

# Example usage
input_file = "/Users/michaelingram/Downloads/CalAccess/DATA/CVR_LOBBY_DISCLOSURE_CD.TSV"
process_large_tsv_dask(input_file)
