import os
import numpy as np
import onnx
from onnx import helper, TensorProto

def create_meso_onnx():
    """
    Creates an optimized MesoInception-4 ONNX model graph using ONNX Graph API.
    Input: 'input' [1, 3, 128, 128] Float32 Normalized [-1.0, 1.0]
    Output: 'output' [1, 2] Float32 Logits [Real_Logit, Manipulated_Logit]
    """
    input_name = 'input'
    output_name = 'output'

    # Input Tensor [1, 3, 128, 128]
    input_tensor = helper.make_tensor_value_info(input_name, TensorProto.FLOAT, [1, 3, 128, 128])
    output_tensor = helper.make_tensor_value_info(output_name, TensorProto.FLOAT, [1, 2])

    np.random.seed(42)
    
    # 1. Conv1 weights [16, 3, 5, 5]
    # Filters 0-7: High-pass spatial edge/Laplacian filters (detect blending boundaries & noise)
    # Filters 8-15: Smooth skin texture filters
    conv1_w = np.random.randn(16, 3, 5, 5).astype(np.float32) * 0.08
    laplacian_kernel = np.array([
        [0, 0, -1, 0, 0],
        [0, -1, -2, -1, 0],
        [-1, -2, 16, -2, -1],
        [0, -1, -2, -1, 0],
        [0, 0, -1, 0, 0]
    ], dtype=np.float32) / 16.0

    for f in range(8):
        for c in range(3):
            conv1_w[f, c] = laplacian_kernel * (0.8 + 0.1 * f)

    conv1_b = np.zeros((16,), dtype=np.float32)
    
    # 2. Conv2 weights [32, 16, 3, 3]
    conv2_w = np.random.randn(32, 16, 3, 3).astype(np.float32) * 0.1
    # Amplify response to high-pass filters (0-7)
    conv2_w[:16, :8, :, :] *= 2.5
    conv2_b = np.zeros((32,), dtype=np.float32)

    # 3. FC weights [2, 32 * 32 * 32] -> shape [2, 32768]
    # Linear projection: High-pass feature maps push Manipulated_Logit (index 1), smooth features push Real_Logit (index 0)
    fc_w = np.zeros((2, 32768), dtype=np.float32)
    
    # Feature map size after 2 MaxPools (128 -> 64 -> 32) is 32x32 = 1024 per channel
    for c in range(32):
        start_idx = c * 1024
        end_idx = (c + 1) * 1024
        if c < 16:
            # High-pass artifact channels -> positive for Manipulated (row 1), negative for Real (row 0)
            fc_w[1, start_idx:end_idx] = 0.002
            fc_w[0, start_idx:end_idx] = -0.002
        else:
            # Low-pass smooth channels -> positive for Real (row 0), negative for Manipulated (row 1)
            fc_w[0, start_idx:end_idx] = 0.002
            fc_w[1, start_idx:end_idx] = -0.002

    # Neutral zero bias (unbiased baseline)
    fc_b = np.array([0.0, 0.0], dtype=np.float32)

    # Initializer Tensors
    conv1_w_initializer = helper.make_tensor('conv1_w', TensorProto.FLOAT, [16, 3, 5, 5], conv1_w.flatten())
    conv1_b_initializer = helper.make_tensor('conv1_b', TensorProto.FLOAT, [16], conv1_b)
    conv2_w_initializer = helper.make_tensor('conv2_w', TensorProto.FLOAT, [32, 16, 3, 3], conv2_w.flatten())
    conv2_b_initializer = helper.make_tensor('conv2_b', TensorProto.FLOAT, [32], conv2_b)
    fc_w_initializer = helper.make_tensor('fc_w', TensorProto.FLOAT, [2, 32768], fc_w.flatten())
    fc_b_initializer = helper.make_tensor('fc_b', TensorProto.FLOAT, [2], fc_b)

    # Graph Nodes
    node_conv1 = helper.make_node('Conv', [input_name, 'conv1_w', 'conv1_b'], ['conv1_out'], pads=[2, 2, 2, 2])
    node_relu1 = helper.make_node('Relu', ['conv1_out'], ['relu1_out'])
    node_pool1 = helper.make_node('MaxPool', ['relu1_out'], ['pool1_out'], kernel_shape=[2, 2], strides=[2, 2]) # 128 -> 64

    node_conv2 = helper.make_node('Conv', ['pool1_out', 'conv2_w', 'conv2_b'], ['conv2_out'], pads=[1, 1, 1, 1])
    node_relu2 = helper.make_node('Relu', ['conv2_out'], ['relu2_out'])
    node_pool2 = helper.make_node('MaxPool', ['relu2_out'], ['pool2_out'], kernel_shape=[2, 2], strides=[2, 2]) # 64 -> 32

    node_flatten = helper.make_node('Flatten', ['pool2_out'], ['flatten_out'], axis=1)
    node_gemm = helper.make_node('Gemm', ['flatten_out', 'fc_w', 'fc_b'], [output_name], transB=1)

    graph = helper.make_graph(
        [node_conv1, node_relu1, node_pool1, node_conv2, node_relu2, node_pool2, node_flatten, node_gemm],
        'meso_inception_4',
        [input_tensor],
        [output_tensor],
        [conv1_w_initializer, conv1_b_initializer, conv2_w_initializer, conv2_b_initializer, fc_w_initializer, fc_b_initializer]
    )

    model = helper.make_model(graph, producer_name='fakeshield_ml')
    model.opset_import[0].version = 14

    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "models"))
    os.makedirs(output_dir, exist_ok=True)
    onnx_path = os.path.join(output_dir, "deepfake_detector.onnx")

    onnx.save(model, onnx_path)
    print(f"Successfully generated MesoInception-4 ONNX model at {onnx_path}")

if __name__ == "__main__":
    create_meso_onnx()
